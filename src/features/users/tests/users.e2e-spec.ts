import { INestApplication } from '@nestjs/common'
import request from 'supertest'
import { UsersTestManager } from './utils/users-test.manager'
import { initTestsSettings } from '../../../common/tests'
import { HttpStatusCodes } from '../../../common/models'
import { DataSource } from 'typeorm'

describe('users', () => {
  let app: INestApplication
  let userTestManger: UsersTestManager
  let httpServer: any
  let dataSource: DataSource

  beforeAll(async () => {
    try {
      const result = await initTestsSettings()
      app = result.app
      userTestManger = result.userTestManger
      httpServer = result.httpServer
      dataSource = result.dataSource
    } catch (err) {
      console.log('@> users tests error: ', err)
    }
  })

  afterAll(async () => {
    await app.close()
  })

  beforeEach(async () => {
    await dataSource.query('DELETE FROM public.users;')
    userTestManger.resetUserIndex()
  })

  it('should get user', async () => {
    const { userResponseBody } = await userTestManger.createUser()
    const userById = await userTestManger.getUser(userResponseBody.id)

    expect(userResponseBody.id).toEqual(userById.id)
  })

  it('should get all created users', async () => {
    const { userResponseBody } = await userTestManger.createUser()
    await userTestManger.createUser()
    await userTestManger.createUser()
    const { username, password } = userTestManger.getSaCredits

    const users = await request(httpServer)
      .get('/api/users')
      .auth(username, password, {
        type: 'basic',
      })
      .expect(HttpStatusCodes.OK_200)

    expect(users.body?.length).toBe(3)
    expect(users.body?.some((u: any) => u.id === userResponseBody.id)).toBeTruthy()
  })

  it('should get paginated users', async () => {
    const { userResponseBody } = await userTestManger.createUser()
    await userTestManger.createSeveralUsers(20)
    const { username, password } = userTestManger.getSaCredits

    const users = await request(httpServer)
      .get('/api/users')
      .query({ page: 2, limit: 10 })
      .auth(username, password, {
        type: 'basic',
      })
      .expect(HttpStatusCodes.OK_200)

    expect(users.body?.length).toBe(10)
    expect(users.body?.some((u: any) => u.id === userResponseBody.id)).toBeFalsy()
  })

  it('should get paginated users with login and email search', async () => {
    const { userResponseBody } = await userTestManger.createUser()
    await userTestManger.createSeveralUsers(12)
    const { username, password } = userTestManger.getSaCredits

    const users = await request(httpServer)
      .get('/api/users')
      .query({ searchEmailTerm: '2', searchLoginTerm: '3' })
      .auth(username, password, {
        type: 'basic',
      })
      .expect(HttpStatusCodes.OK_200)

    expect(users.body?.length).toBe(4)
    expect(users.body?.some((u: any) => u.id === userResponseBody.id)).toBeFalsy()
  })

  it('should create user', async () => {
    const { userResponseBody, userRequestBody } = await userTestManger.createUser()

    userTestManger.expectCorrectModel(userRequestBody, userResponseBody)
  })

  it('should get user', async () => {
    const { userResponseBody } = await userTestManger.createUser()
    const userById = await userTestManger.getUser(userResponseBody.id)

    expect(userResponseBody).toEqual(userById)
  })

  it('should delete user', async () => {
    const { userResponseBody } = await userTestManger.createUser()
    const { username, password } = userTestManger.getSaCredits

    await request(httpServer)
      .delete(`/api/users/${userResponseBody.id}`)
      .auth(username, password, {
        type: 'basic',
      })
      .expect(HttpStatusCodes.NO_CONTENT_204)

    const userById = await userTestManger.getUser(userResponseBody.id)

    expect(userById.statusCode).toBe(HttpStatusCodes.NOT_FOUND_404)
  })
})

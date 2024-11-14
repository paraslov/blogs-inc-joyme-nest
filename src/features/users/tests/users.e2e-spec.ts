import { INestApplication } from '@nestjs/common'
import request from 'supertest'
import { UsersTestManager } from './utils/users-test.manager'
import { initTestsSettings } from '../../../common/tests'
import { HttpStatusCodes } from '../../../common/models'

describe('users', () => {
  let app: INestApplication
  let userTestManger: UsersTestManager
  let httpServer: any

  beforeAll(async () => {
    try {
      const result = await initTestsSettings()
      app = result.app
      userTestManger = result.userTestManger
      httpServer = result.httpServer
    } catch (err) {
      console.log('@> users tests error: ', err)
    }
  })

  afterAll(async () => {
    await app.close()
  })

  it('should get user', async () => {
    const { userResponseBody } = await userTestManger.createUser()
    const userById = await userTestManger.getUser(userResponseBody.id)

    expect(userResponseBody.id).toEqual(userById.id)
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

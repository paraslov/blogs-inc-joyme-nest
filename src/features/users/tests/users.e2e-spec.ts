import { INestApplication } from '@nestjs/common'
import request from 'supertest'
import { UsersTestManager } from './utils/users-test-manager'
import { initTestsSettings } from '../../../common/tests'
import { HttpStatusCodes } from '../../../common/models'

describe('users', () => {
  let app: INestApplication
  let userTestManger: UsersTestManager

  beforeAll(async () => {
    try {
      const result = await initTestsSettings()
      app = result.app
      userTestManger = result.userTestManger
    } catch (err) {
      console.log('@> users tests error: ', err)
    }
  })

  afterAll(async () => {
    await app.close()
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
    const { username, password } = userTestManger.saCredits

    await request(app.getHttpServer())
      .delete(`/api/users/${userResponseBody.id}`)
      .auth(username, password, {
        type: 'basic',
      })
      .expect(HttpStatusCodes.NO_CONTENT_204)

    const userById = await userTestManger.getUser(userResponseBody.id)

    expect(userById.statusCode).toBe(HttpStatusCodes.NOT_FOUND_404)
  })
})

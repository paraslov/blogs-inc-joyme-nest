import { INestApplication } from '@nestjs/common'
import { UsersTestManager } from '../../users'
import { initTestsSettings } from '../../../common/tests'
import request from 'supertest'
import { HttpStatusCodes } from '../../../common/models'
import { AuthTestManager } from './utils/auth-test.manager'

describe('auth', () => {
  let app: INestApplication
  let userTestManger: UsersTestManager
  let authTestManager: AuthTestManager
  let httpServer: any

  beforeAll(async () => {
    try {
      const result = await initTestsSettings()
      app = result.app
      httpServer = result.httpServer
      userTestManger = result.userTestManger

      authTestManager = new AuthTestManager(app)
    } catch (err) {
      console.log('@> auth tests error: ', err)
    }
  })

  afterAll(async () => {
    await app.close()
  })

  it('should login user', async () => {
    const { userRequestBody, userResponseBody } = await userTestManger.createUser()

    const response = await request(httpServer)
      .post('/api/auth/login')
      .send({ loginOrEmail: userResponseBody.email, password: userRequestBody.password })
      .expect(HttpStatusCodes.OK_200)

    const cookies: any = response.headers['set-cookie']
    const refreshToken = authTestManager.getRefreshTokenFromResponseCookies(cookies)

    expect(response.body.accessToken).toEqual(expect.any(String))
    expect(refreshToken).toEqual(expect.any(String))
  })
})

import { INestApplication } from '@nestjs/common'
import { UsersTestManager } from '../../users'
import { initTestsSettings } from '../../../common/tests'
import { AuthTestManager } from './utils/auth-test.manager'
import request from 'supertest'
import { HttpStatusCodes } from '../../../common/models'
import { DevicesTestManager } from '../../devices'

describe('auth', () => {
  let app: INestApplication
  let userTestManger: UsersTestManager
  let httpServer: any
  let authTestManager: AuthTestManager
  let devicesTestManager: DevicesTestManager

  beforeAll(async () => {
    try {
      const result = await initTestsSettings()
      app = result.app
      httpServer = result.httpServer
      userTestManger = result.userTestManger

      authTestManager = new AuthTestManager(app)
      devicesTestManager = new DevicesTestManager(app)
    } catch (err) {
      console.log('@> auth tests error: ', err)
    }
  })

  afterAll(async () => {
    await app.close()
  })

  it('should login user', async () => {
    const { userRequestBody } = await userTestManger.createUser()

    const { accessToken, cookies } = await UsersTestManager.login(app, userRequestBody.login, userRequestBody.password)
    const refreshToken = authTestManager.getRefreshTokenFromResponseCookies(cookies)

    expect(accessToken).toEqual(expect.any(String))
    expect(refreshToken).toEqual(expect.any(String))
  })

  it('should logout user, cant refresh', async () => {
    const { userRequestBody } = await userTestManger.createUser()

    const { cookies } = await UsersTestManager.login(app, userRequestBody.login, userRequestBody.password)
    const refreshToken = authTestManager.getRefreshTokenFromResponseCookies(cookies)

    await request(httpServer)
      .post('/api/auth/logout')
      .set({ Cookie: `refreshToken=${refreshToken}` })
      .expect(HttpStatusCodes.NO_CONTENT_204)
    await request(httpServer)
      .post('/api/auth/refresh-token')
      .set({ Cookie: `refreshToken=${refreshToken}` })
      .expect(HttpStatusCodes.UNAUTHORIZED_401)
  })
})

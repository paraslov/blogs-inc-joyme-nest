import { INestApplication } from '@nestjs/common'
import { UsersTestManager } from '../../users'
import { initTestsSettings, wait } from '../../../common/tests'
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
    const { userRequestBody } = await userTestManger.createUser()

    const { accessToken, cookies } = await UsersTestManager.login(app, userRequestBody.login, userRequestBody.password)
    const refreshToken = authTestManager.getRefreshTokenFromResponseCookies(cookies)

    expect(accessToken).toEqual(expect.any(String))
    expect(refreshToken).toEqual(expect.any(String))
  })

  it('should refresh user tokens', async () => {
    const { userRequestBody } = await userTestManger.createUser()
    const { cookies } = await UsersTestManager.login(app, userRequestBody.login, userRequestBody.password)
    const refreshToken = authTestManager.getRefreshTokenFromResponseCookies(cookies)
    await wait(1)

    const response = await request(httpServer)
      .post('/api/auth/refresh-token')
      .set({ Cookie: `refreshToken=${refreshToken}` })
      .expect(HttpStatusCodes.OK_200)
    const updateResponseCookies = response.headers['set-cookie']
    const updatedRefreshToken = authTestManager.getRefreshTokenFromResponseCookies(updateResponseCookies)

    expect(response.body.accessToken).toEqual(expect.any(String))
    expect(updatedRefreshToken).toEqual(expect.any(String))
    expect(updatedRefreshToken === refreshToken).toBeFalsy()
  })
})

import { INestApplication } from '@nestjs/common'
import { UsersTestManager } from '../../users'
import { aDescribe, initTestsSettings, skipSettings, wait } from '../../../common/tests'
import request from 'supertest'
import { HttpStatusCodes } from '../../../common/models'
import { AuthTestManager } from './utils/auth-test.manager'
import { DevicesTestManager } from '../../devices'

aDescribe(skipSettings.for('auth_refresh'))('>> auth_refresh <<', () => {
  let app: INestApplication
  let userTestManger: UsersTestManager
  let authTestManager: AuthTestManager
  let devicesTestManager: DevicesTestManager
  let httpServer: any

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

  it('should refresh user tokens: ', async () => {
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

  it('should 401 if refresh invalid :', async () => {
    const invalidRefreshToken = `invalid.refresh.token`

    await request(httpServer)
      .post('/api/auth/refresh-token')
      .set({ Cookie: `refreshToken=${invalidRefreshToken}` })
      .expect(HttpStatusCodes.UNAUTHORIZED_401)
  })

  it('should get me info after tokens update: ', async () => {
    const { userRequestBody } = await userTestManger.createUser()
    const { cookies } = await UsersTestManager.login(app, userRequestBody.login, userRequestBody.password)
    const refreshToken = authTestManager.getRefreshTokenFromResponseCookies(cookies)
    await wait(1)

    const response = await request(httpServer)
      .post('/api/auth/refresh-token')
      .set({ Cookie: `refreshToken=${refreshToken}` })
      .expect(HttpStatusCodes.OK_200)

    const meResponse = await authTestManager.getMe(response.body.accessToken)

    expect(meResponse.userId).toEqual(expect.any(String))
    expect(meResponse.email).toBe(userRequestBody.email)
    expect(meResponse.login).toBe(userRequestBody.login)
  })

  it('should update devices lastUpdate time after tokens update: ', async () => {
    const { userRequestBody } = await userTestManger.createUser()
    const { cookies } = await UsersTestManager.login(app, userRequestBody.login, userRequestBody.password)
    const refreshToken = authTestManager.getRefreshTokenFromResponseCookies(cookies)
    await wait(1)

    const devicesBeforeUpdate = await devicesTestManager.getDevices(refreshToken)
    const deviceBeforeUpdate = devicesBeforeUpdate[0]

    const response = await request(httpServer)
      .post('/api/auth/refresh-token')
      .set({ Cookie: `refreshToken=${refreshToken}` })
      .expect(HttpStatusCodes.OK_200)
    const updateResponseCookies = response.headers['set-cookie']
    const updatedRefreshToken = authTestManager.getRefreshTokenFromResponseCookies(updateResponseCookies)

    const devicesAfterUpdate = await devicesTestManager.getDevices(updatedRefreshToken)
    const deviceAfterUpdate = devicesAfterUpdate[0]

    const currentYear = new Date().getFullYear()

    expect(deviceBeforeUpdate?.lastActiveDate !== deviceAfterUpdate?.lastActiveDate).toBeTruthy()
    expect(deviceAfterUpdate?.lastActiveDate.includes('1970')).toBeFalsy()
    expect(deviceAfterUpdate?.lastActiveDate.includes(currentYear.toString())).toBeTruthy()
    expect(deviceAfterUpdate?.deviceId === deviceBeforeUpdate?.deviceId).toBeTruthy()
  })

  it('should 401 old refresh token after update: ', async () => {
    const { userRequestBody } = await userTestManger.createUser()
    const { cookies } = await UsersTestManager.login(app, userRequestBody.login, userRequestBody.password)
    const refreshToken = authTestManager.getRefreshTokenFromResponseCookies(cookies)
    await wait(1)

    const response = await request(httpServer)
      .post('/api/auth/refresh-token')
      .set({ Cookie: `refreshToken=${refreshToken}` })
      .expect(HttpStatusCodes.OK_200)

    await request(httpServer)
      .post('/api/auth/refresh-token')
      .set({ Cookie: `refreshToken=${refreshToken}` })
      .expect(HttpStatusCodes.UNAUTHORIZED_401)

    expect(response.body.accessToken).toEqual(expect.any(String))
  })
})

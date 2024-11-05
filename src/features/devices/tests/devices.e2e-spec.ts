import { INestApplication } from '@nestjs/common'
import { UsersTestManager } from '../../users'
import { initTestsSettings, wait } from '../../../common/tests'
import { AuthTestManager } from '../../auth'
import request from 'supertest'
import { HttpStatusCodes } from '../../../common/models'
import { DevicesTestManager } from './utils/devices.test-manager'
import { JwtService } from '@nestjs/jwt'

describe('auth', () => {
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

      devicesTestManager = new DevicesTestManager(app, new JwtService())
      authTestManager = new AuthTestManager(app)
    } catch (err) {
      console.log('@> auth tests error: ', err)
    }
  })

  afterAll(async () => {
    await app.close()
  })

  it('should get device session: ', async () => {
    const { userRequestBody } = await userTestManger.createUser()
    const { cookies } = await UsersTestManager.login(app, userRequestBody.login, userRequestBody.password)
    const refreshToken = authTestManager.getRefreshTokenFromResponseCookies(cookies)

    const responseBody = await devicesTestManager.getDevices(refreshToken)

    expect(responseBody[0].deviceId).toEqual(expect.any(String))
  })

  it('should delete all device session except current: ', async () => {
    const { userRequestBody } = await userTestManger.createUser()
    const { cookies } = await UsersTestManager.login(app, userRequestBody.login, userRequestBody.password)
    await UsersTestManager.login(app, userRequestBody.login, userRequestBody.password)
    await UsersTestManager.login(app, userRequestBody.login, userRequestBody.password)
    const refreshToken = authTestManager.getRefreshTokenFromResponseCookies(cookies)

    const responseBody = await devicesTestManager.getDevices(refreshToken)

    await request(httpServer)
      .delete('/api/security/devices')
      .set({ Cookie: `refreshToken=${refreshToken}` })
      .expect(HttpStatusCodes.NO_CONTENT_204)

    const responseAfterDeleteBody = await devicesTestManager.getDevices(refreshToken)

    expect(responseBody.length).toBe(3)
    expect(responseAfterDeleteBody.length).toBe(1)
  })

  it('should delete device session by device id: ', async () => {
    await wait(1)
    const { userRequestBody } = await userTestManger.createUser()
    const { cookies } = await UsersTestManager.login(app, userRequestBody.login, userRequestBody.password)
    await UsersTestManager.login(app, userRequestBody.login, userRequestBody.password)
    const { cookies: cookiesToDelete } = await UsersTestManager.login(
      app,
      userRequestBody.login,
      userRequestBody.password,
    )
    const refreshToken = authTestManager.getRefreshTokenFromResponseCookies(cookies)
    const refreshTokenToDelete = authTestManager.getRefreshTokenFromResponseCookies(cookiesToDelete)
    const { deviceId: deviceIdToDelete } = devicesTestManager.decodeRefreshToken(refreshTokenToDelete)

    const responseBody = await devicesTestManager.getDevices(refreshToken)

    await request(httpServer)
      .delete(`/api/security/devices/${deviceIdToDelete}`)
      .set({ Cookie: `refreshToken=${refreshToken}` })
      .expect(HttpStatusCodes.NO_CONTENT_204)

    const responseAfterDeleteBody = await devicesTestManager.getDevices(refreshToken)

    expect(responseBody.length).toBe(3)
    expect(responseAfterDeleteBody.length).toBe(2)
    expect(responseAfterDeleteBody.some((device: any) => device.deviceId === deviceIdToDelete)).toBeFalsy()
  })

  it('should throw 403 if trying to delete other user device: ', async () => {
    await wait(1)
    const { userRequestBody } = await userTestManger.createUser()
    const { userRequestBody: otherUserRequestBody } = await userTestManger.createUser()

    const { cookies } = await UsersTestManager.login(app, userRequestBody.login, userRequestBody.password)
    await UsersTestManager.login(app, userRequestBody.login, userRequestBody.password)

    const { cookies: otherUserCookies } = await UsersTestManager.login(
      app,
      otherUserRequestBody.login,
      otherUserRequestBody.password,
    )

    const { cookies: cookiesToDelete } = await UsersTestManager.login(
      app,
      userRequestBody.login,
      userRequestBody.password,
    )
    const refreshToken = authTestManager.getRefreshTokenFromResponseCookies(cookies)
    const refreshTokenToDelete = authTestManager.getRefreshTokenFromResponseCookies(cookiesToDelete)
    const otherUserRefreshToken = authTestManager.getRefreshTokenFromResponseCookies(otherUserCookies)
    const { deviceId: deviceIdToDelete } = devicesTestManager.decodeRefreshToken(refreshTokenToDelete)

    const responseBody = await devicesTestManager.getDevices(refreshToken)

    await request(httpServer)
      .delete(`/api/security/devices/${deviceIdToDelete}`)
      .set({ Cookie: `refreshToken=${otherUserRefreshToken}` })
      .expect(HttpStatusCodes.FORBIDDEN_403)

    const responseAfterDeleteBody = await devicesTestManager.getDevices(refreshToken)

    expect(responseBody.length).toBe(3)
    expect(responseAfterDeleteBody.length).toBe(3)
  })
})

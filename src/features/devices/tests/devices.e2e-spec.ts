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

      devicesTestManager = new DevicesTestManager(new JwtService())
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

    const response = await request(httpServer)
      .get('/api/security/devices')
      .set({ Cookie: `refreshToken=${refreshToken}` })
      .expect(HttpStatusCodes.OK_200)

    expect(response.body?.[0].deviceId).toEqual(expect.any(String))
  })

  it('should delete all device session except current: ', async () => {
    const { userRequestBody } = await userTestManger.createUser()
    const { cookies } = await UsersTestManager.login(app, userRequestBody.login, userRequestBody.password)
    await UsersTestManager.login(app, userRequestBody.login, userRequestBody.password)
    await UsersTestManager.login(app, userRequestBody.login, userRequestBody.password)
    const refreshToken = authTestManager.getRefreshTokenFromResponseCookies(cookies)

    const response = await request(httpServer)
      .get('/api/security/devices')
      .set({ Cookie: `refreshToken=${refreshToken}` })
      .expect(HttpStatusCodes.OK_200)

    await request(httpServer)
      .delete('/api/security/devices')
      .set({ Cookie: `refreshToken=${refreshToken}` })
      .expect(HttpStatusCodes.NO_CONTENT_204)

    const responseAfterDelete = await request(httpServer)
      .get('/api/security/devices')
      .set({ Cookie: `refreshToken=${refreshToken}` })
      .expect(HttpStatusCodes.OK_200)

    expect(response.body.length).toBe(3)
    expect(responseAfterDelete.body.length).toBe(1)
  })

  it('should delete all device session except current: ', async () => {
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

    const response = await request(httpServer)
      .get('/api/security/devices')
      .set({ Cookie: `refreshToken=${refreshToken}` })
      .expect(HttpStatusCodes.OK_200)

    await request(httpServer)
      .delete(`/api/security/devices/${deviceIdToDelete}`)
      .set({ Cookie: `refreshToken=${refreshToken}` })
      .expect(HttpStatusCodes.NO_CONTENT_204)

    const responseAfterDelete = await request(httpServer)
      .get('/api/security/devices')
      .set({ Cookie: `refreshToken=${refreshToken}` })
      .expect(HttpStatusCodes.OK_200)

    console.log('@> responseAfterDelete.body: ', responseAfterDelete.body)

    expect(response.body.length).toBe(3)
    expect(responseAfterDelete.body.length).toBe(2)
    expect(responseAfterDelete.body.some((device: any) => device.deviceId === deviceIdToDelete)).toBeFalsy()
  })
})

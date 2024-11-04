import { INestApplication } from '@nestjs/common'
import { UsersTestManager } from '../../users'
import { initTestsSettings } from '../../../common/tests'
import { AuthTestManager } from '../../auth'
import request from 'supertest'
import { HttpStatusCodes } from '../../../common/models'

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

  it('should get device session: ', async () => {
    const { userRequestBody } = await userTestManger.createUser()
    const { cookies } = await UsersTestManager.login(app, userRequestBody.login, userRequestBody.password)
    const refreshToken = authTestManager.getRefreshTokenFromResponseCookies(cookies)

    const response = await request(httpServer)
      .get('/api/security/devices')
      .set({ Cookie: `refreshToken=${refreshToken}` })
      .expect(HttpStatusCodes.OK_200)

    console.log('@> response: ', response.body)
  })
})

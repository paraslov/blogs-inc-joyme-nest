import { INestApplication } from '@nestjs/common'
import { UsersTestManager } from '../../users'
import { initTestsSettings } from '../../../common/tests'
import request from 'supertest'
import { HttpStatusCodes } from '../../../common/models'
import { AuthTestManager } from './utils/auth-test.manager'
import { DevicesTestManager } from '../../devices'
import { EmailSendManager } from '../../../common/manager'
import { EmailSendManagerMock } from './mocks/EmailSendManagerMock'

describe('>auth reg actions<', () => {
  let app: INestApplication
  let userTestManger: UsersTestManager
  let authTestManager: AuthTestManager
  let devicesTestManager: DevicesTestManager
  let httpServer: any

  beforeAll(async () => {
    try {
      const result = await initTestsSettings((moduleBuilder) => {
        moduleBuilder.overrideProvider(EmailSendManager).useClass(EmailSendManagerMock)
      })
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

  it('should register user: ', async () => {
    const requestBody = {
      login: 'myLogin',
      password: 'myPassword#$%',
      email: 'balanov.kaspi@gmail.com',
    }
    await request(httpServer).post('/api/auth/registration').send(requestBody).expect(HttpStatusCodes.NO_CONTENT_204)

    const { accessToken } = await UsersTestManager.login(app, requestBody.login, requestBody.password)
    console.log('@> accessToken : ', accessToken)

    expect(accessToken).toEqual(expect.any(String))
  })
})

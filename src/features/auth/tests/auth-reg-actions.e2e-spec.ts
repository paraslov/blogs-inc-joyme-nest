import { INestApplication } from '@nestjs/common'
import { UsersTestManager } from '../../users'
import { initTestsSettings } from '../../../common/tests'
import request from 'supertest'
import { HttpStatusCodes } from '../../../common/models'
import { AuthTestManager } from './utils/auth-test.manager'
import { DevicesTestManager } from '../../devices'
import { EmailSendManager } from '../../../common/manager'
import { EmailSendManagerMock } from './mocks/EmailSendManagerMock'
import { AuthSqlRepository } from '../infrastructure/auth.sql-repository'

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

      authTestManager = new AuthTestManager(app, new AuthSqlRepository(result.dataSource))
      devicesTestManager = new DevicesTestManager(app)
    } catch (err) {
      console.log('@> auth tests error: ', err)
    }
  })

  afterAll(async () => {
    await app.close()
  })

  it('should register user and login after: ', async () => {
    const requestBody = {
      login: 'myLogin',
      password: 'myPassword#$%',
      email: 'balanov.kaspi@gmail.com',
    }
    await request(httpServer).post('/api/auth/registration').send(requestBody).expect(HttpStatusCodes.NO_CONTENT_204)

    const { accessToken } = await UsersTestManager.login(app, requestBody.login, requestBody.password)

    expect(accessToken).toEqual(expect.any(String))
  })

  it('should got bad request if login or email already exists: ', async () => {
    const requestBody = {
      login: 'myLogin1',
      password: 'myPassword#$%',
      email: 'myEmail1@gl.co',
    }
    await request(httpServer).post('/api/auth/registration').send(requestBody).expect(HttpStatusCodes.NO_CONTENT_204)

    await request(httpServer)
      .post('/api/auth/registration')
      .send({ ...requestBody, email: 'other@email.co' })
      .expect(HttpStatusCodes.BAD_REQUEST_400)
    await request(httpServer)
      .post('/api/auth/registration')
      .send({ ...requestBody, login: 'otherLogin' })
      .expect(HttpStatusCodes.BAD_REQUEST_400)
  })

  it('should confirm user registration: ', async () => {
    const requestBody = {
      login: 'myLogin3',
      password: 'myPassword#$%',
      email: 'myEmail3@gl.co',
    }
    await request(httpServer).post('/api/auth/registration').send(requestBody).expect(HttpStatusCodes.NO_CONTENT_204)
    const user = await authTestManager.getUserByLogin(requestBody.login)

    await request(httpServer)
      .post('/api/auth/registration-confirmation')
      .send({ code: user.userInfo.confirmation_code })
      .expect(HttpStatusCodes.NO_CONTENT_204)
    const userAfterConfirm = await authTestManager.getUserByLogin(requestBody.login)

    expect(user.userInfo.is_confirmed).toBeFalsy()
    expect(userAfterConfirm.userInfo.is_confirmed).toBeTruthy()
  })
})

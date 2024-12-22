import { INestApplication } from '@nestjs/common'
import { UserDbModel, UserInfo, UsersTestManager } from '../../users'
import { aDescribe, initTestsSettings, skipSettings } from '../../../common/tests'
import request from 'supertest'
import { HttpStatusCodes } from '../../../common/models'
import { AuthTestManager } from './utils/auth-test.manager'
import { EmailSendManager } from '../../../common/manager'
import { EmailSendManagerMock } from './mocks/EmailSendManagerMock'
import { AuthRepository } from '../infrastructure/auth.repository'
import { Repository } from 'typeorm'
import { getRepositoryToken } from '@nestjs/typeorm'

aDescribe(skipSettings.for('auth_reg_actions'))('>> auth_reg_actions <<', () => {
  let app: INestApplication
  let authTestManager: AuthTestManager
  let httpServer: any

  beforeAll(async () => {
    try {
      const result = await initTestsSettings((moduleBuilder) => {
        moduleBuilder.overrideProvider(EmailSendManager).useClass(EmailSendManagerMock)
      })
      app = result.app
      httpServer = result.httpServer

      const userRepository = app.get<Repository<UserDbModel>>(getRepositoryToken(UserDbModel))
      const userInfoRepository = app.get<Repository<UserInfo>>(getRepositoryToken(UserInfo))
      authTestManager = new AuthTestManager(
        app,
        new AuthRepository(result.dataSource, userRepository, userInfoRepository),
      )
    } catch (err) {
      console.log('@> auth tests error: ', err)
    }
  })

  afterAll(async () => {
    await app.close()
  })

  it('should register user and login after: ', async () => {
    const { requestBody } = await authTestManager.registerUser()

    const { accessToken } = await UsersTestManager.login(app, requestBody.login, requestBody.password)

    expect(accessToken).toEqual(expect.any(String))
  })

  it('should got bad request if login or email already exists: ', async () => {
    const requestBody = {
      login: 'myLogin1',
      password: 'myPassword#$%',
      email: 'myEmail1@gl.co',
    }
    await authTestManager.registerUser(requestBody)

    await authTestManager.registerUser(
      { ...requestBody, email: 'other@email.co' },
      { expectedStatus: HttpStatusCodes.BAD_REQUEST_400 },
    )
    await authTestManager.registerUser(
      { ...requestBody, login: 'otherLogin' },
      { expectedStatus: HttpStatusCodes.BAD_REQUEST_400 },
    )
  })

  it('should confirm user registration: ', async () => {
    const { requestBody } = await authTestManager.registerUser()
    const user = await authTestManager.getUserByLogin(requestBody.login)

    await request(httpServer)
      .post('/api/auth/registration-confirmation')
      .send({ code: user.userInfo.confirmation_code })
      .expect(HttpStatusCodes.NO_CONTENT_204)
    const userAfterConfirm = await authTestManager.getUserByLogin(requestBody.login)

    expect(user.userInfo.is_confirmed).toBeFalsy()
    expect(userAfterConfirm.userInfo.is_confirmed).toBeTruthy()
  })

  it('should resend user registration email: ', async () => {
    const { requestBody } = await authTestManager.registerUser()
    const userData = await authTestManager.getUserByLogin(requestBody.login)

    await request(httpServer)
      .post('/api/auth/registration-email-resending')
      .send({ email: requestBody.email })
      .expect(HttpStatusCodes.NO_CONTENT_204)
    const userAfterResend = await authTestManager.getUserByLogin(requestBody.login)

    expect(
      userData.userInfo.confirmation_code_expiration_date !==
        userAfterResend.userInfo.confirmation_code_expiration_date,
    ).toBeTruthy()
    expect(userData.userInfo.confirmation_code !== userAfterResend.userInfo.confirmation_code).toBeTruthy()
  })

  it('should send user password recovery email: ', async () => {
    const { requestBody } = await authTestManager.registerUser()
    const userData = await authTestManager.getUserByLogin(requestBody.login)

    await request(httpServer)
      .post('/api/auth/password-recovery')
      .send({ email: requestBody.email })
      .expect(HttpStatusCodes.NO_CONTENT_204)
    const userAfterPasswordRecoveryEmail = await authTestManager.getUserByLogin(requestBody.login)

    expect(userData.userInfo.password_recovery_code).toBeFalsy()
    expect(userAfterPasswordRecoveryEmail.userInfo.password_recovery_code).toStrictEqual(expect.any(String))
    expect(userAfterPasswordRecoveryEmail.userInfo.password_recovery_code_expiration_date).toStrictEqual(
      expect.any(Date),
    )
    expect(userAfterPasswordRecoveryEmail.userInfo.is_password_recovery_confirmed).toBeFalsy()
  })

  it('should change user password after recovery email: ', async () => {
    const { requestBody } = await authTestManager.registerUser()

    await request(httpServer)
      .post('/api/auth/password-recovery')
      .send({ email: requestBody.email })
      .expect(HttpStatusCodes.NO_CONTENT_204)
    const userAfterPasswordRecoveryEmail = await authTestManager.getUserByLogin(requestBody.login)

    const passwordRecoveryDto = {
      newPassword: 'myNewPass$%$#',
      recoveryCode: userAfterPasswordRecoveryEmail.userInfo.password_recovery_code,
    }
    await request(httpServer)
      .post('/api/auth/new-password')
      .send(passwordRecoveryDto)
      .expect(HttpStatusCodes.NO_CONTENT_204)
    const userAfterPasswordRecovery = await authTestManager.getUserByLogin(requestBody.login)

    expect(userAfterPasswordRecoveryEmail.userInfo.is_password_recovery_confirmed).toBeFalsy()
    expect(userAfterPasswordRecovery.userInfo.is_password_recovery_confirmed).toBeTruthy()
  })
})

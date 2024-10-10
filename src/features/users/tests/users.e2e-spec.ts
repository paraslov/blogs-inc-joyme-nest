import { INestApplication } from '@nestjs/common'
import request from 'supertest'
import { UsersTestManager } from './utils/users-test-manager'
import { initTestsSettings } from '../../../common/tests'

describe('users', () => {
  let app: INestApplication
  let userTestManger: UsersTestManager

  beforeAll(async () => {
    try {
      const result = await initTestsSettings()
      app = result.app
      userTestManger = result.userTestManger
    } catch (err) {
      console.log('@> users tests error: ', err)
    }
  })

  afterAll(async () => {
    await app.close()
  })

  it('should create user', async () => {
    const body = { login: 'name111', password: 'pass12#', email: 'email@email.em' }

    const response = await userTestManger.createUser(body)

    userTestManger.expectCorrectModel(body, response.body)
  })

  it('should get user', async () => {
    const body = { login: 'name112', password: 'pass13#', email: 'email1@email.em' }

    const createUserResponse = await userTestManger.createUser(body)
    const { username, password } = userTestManger.saCredits

    const getUserResponse = await request(app.getHttpServer())
      .get(`/api/users?searchEmailTerm=${body.email}`)
      .auth(username, password, {
        type: 'basic',
      })
      .expect(200)

    expect(createUserResponse.body).toEqual(getUserResponse.body.items[0])
  })
})

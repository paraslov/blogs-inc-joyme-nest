import { INestApplication } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import request from 'supertest'
import { CreateUserDto } from '../../index'
import { ConfigurationType } from '../../../../settings/configuration'
import { HttpStatusCodes } from '../../../../common/models'
import { UserViewDto } from '../../api/models/output/userViewDto'

export class UsersTestManager {
  constructor(
    protected readonly app: INestApplication,
    private readonly configService: ConfigService<ConfigurationType>,
  ) {}
  username = this.configService.get('jwtSettings').SA_USER_USERNAME
  password = this.configService.get('jwtSettings').SA_USER_PASSWORD
  userIndex = 0

  get getSaCredits() {
    return {
      username: this.username,
      password: this.password,
    }
  }

  private get getUserModel(): CreateUserDto {
    this.userIndex++

    return {
      login: `login${this.userIndex}`,
      email: `email${this.userIndex}@service.oom`,
      password: `passworD#$${this.userIndex}`,
    }
  }

  resetUserIndex() {
    this.userIndex = 0
  }

  expectCorrectModel(createModel: CreateUserDto, responseModel: UserViewDto) {
    expect(createModel.login).toBe(responseModel.login)
    expect(createModel.email).toBe(responseModel.email)
    expect(responseModel.createdAt).toStrictEqual(expect.any(String))
    expect(responseModel.id).toStrictEqual(expect.any(String))
  }

  async createUser(
    createUserDto?: CreateUserDto,
    username?: string,
    password?: string,
  ): Promise<{ userRequestBody: CreateUserDto; userResponseBody: UserViewDto }> {
    const saUsername = username ?? this.username
    const saPassword = password ?? this.password

    const requestBody = createUserDto ?? this.getUserModel
    const response = await request(this.app.getHttpServer())
      .post('/api/sa/users')
      .auth(saUsername, saPassword, {
        type: 'basic',
      })
      .send(requestBody)
      .expect(HttpStatusCodes.CREATED_201)

    return {
      userRequestBody: requestBody,
      userResponseBody: response.body,
    }
  }

  async createSeveralUsers(usersCount: number) {
    const arr = Array(usersCount).fill(0)

    const promises = arr.map(async () => {
      return await this.createUser()
    })

    return await Promise.all(promises)
  }

  async getUser(userId: string) {
    const response = await request(this.app.getHttpServer())
      .get(`/api/sa/users/${userId}`)
      .auth(this.username, this.password, {
        type: 'basic',
      })

    return response.body
  }

  static async login(
    app: INestApplication,
    loginOrEmail: string,
    password: string,
  ): Promise<{ accessToken: string; cookies: string | string[] }> {
    const loginResult = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({ loginOrEmail, password })
      .expect(HttpStatusCodes.OK_200)
    const cookies = loginResult.headers['set-cookie']

    return { accessToken: loginResult.body.accessToken, cookies }
  }
}

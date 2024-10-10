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

  get saCredits() {
    return {
      username: this.username,
      password: this.password,
    }
  }

  expectCorrectModel(createModel: CreateUserDto, responseModel: UserViewDto) {
    expect(createModel.login).toBe(responseModel.login)
    expect(createModel.email).toBe(responseModel.email)
    expect(responseModel.createdAt).toStrictEqual(expect.any(String))
    expect(responseModel.id).toStrictEqual(expect.any(String))
  }

  async createUser(createModel: CreateUserDto, username?: string, password?: string) {
    const saUsername = username ?? this.username
    const saPassword = password ?? this.password

    return request(this.app.getHttpServer())
      .post('/api/users')
      .auth(saUsername, saPassword, {
        type: 'basic',
      })
      .send(createModel)
      .expect(HttpStatusCodes.CREATED_201)
  }

  async updateUser(updateModel: any, username?: string, password?: string) {
    const saUsername = username ?? this.username
    const saPassword = password ?? this.password

    return request(this.app.getHttpServer())
      .put('/api/users')
      .auth(saUsername, saPassword, {
        type: 'basic',
      })
      .send(updateModel)
      .expect(HttpStatusCodes.NO_CONTENT_204)
  }

  static async login(app: INestApplication, loginOrEmail: string, password: string): Promise<{ accessToken: string }> {
    await request(app.getHttpServer()).post('/login').send({ loginOrEmail, password }).expect(200)

    return { accessToken: 'qwerty.access.token' }
  }
}

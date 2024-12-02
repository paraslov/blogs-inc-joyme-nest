import { INestApplication } from '@nestjs/common'
import request from 'supertest'
import { HttpStatusCodes } from '../../../../common/models'
import { MeViewModelDto } from '../../api/models/output/me-view-model.dto'
import { AuthRepository } from '../../infrastructure/auth.repository.service'
import { CreateUserDto } from '../../../users'

export class AuthTestManager {
  constructor(
    protected readonly app: INestApplication,
    private authSqlRepository?: AuthRepository,
  ) {}
  httpServer = this.app.getHttpServer()
  userIndex = 0

  private get getUserModel(): CreateUserDto {
    this.userIndex++

    return {
      login: `login${this.userIndex}`,
      email: `email${this.userIndex}@service.oom`,
      password: `passworD#$${this.userIndex}`,
    }
  }

  getRefreshTokenFromResponseCookies = (cookies: string | string[]) => {
    if (typeof cookies === 'string') {
      cookies = [cookies]
    }

    const refreshCookie = cookies.find((cookie: string) => cookie.includes('refreshToken'))

    return refreshCookie?.slice(13)?.split(';')?.[0] ?? null
  }

  async getMe(
    accessToken: string,
    options: { expectedStatus: HttpStatusCodes } = { expectedStatus: HttpStatusCodes.OK_200 },
  ): Promise<MeViewModelDto> {
    const meResponse = await request(this.httpServer)
      .get('/api/auth/me')
      .auth(accessToken, {
        type: 'bearer',
      })
      .expect(options.expectedStatus)

    return meResponse.body
  }

  async registerUser(
    createUserDto?: CreateUserDto,
    options: { expectedStatus: HttpStatusCodes } = { expectedStatus: HttpStatusCodes.NO_CONTENT_204 },
  ) {
    const requestBody = createUserDto ?? this.getUserModel

    await request(this.httpServer).post('/api/auth/registration').send(requestBody).expect(options.expectedStatus)

    return { requestBody }
  }

  async getUserByLogin(userLogin: string) {
    const response = await this.authSqlRepository.getUserByLoginOrEmail(userLogin)

    return response
  }
}

import { INestApplication } from '@nestjs/common'
import request from 'supertest'
import { HttpStatusCodes } from '../../../../common/models'
import { MeViewModelDto } from '../../api/models/output/me-view-model.dto'
import { AuthSqlRepository } from '../../infrastructure/auth.sql-repository'

export class AuthTestManager {
  constructor(
    protected readonly app: INestApplication,
    private authSqlRepository: AuthSqlRepository,
  ) {}
  httpServer = this.app.getHttpServer()

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

  async getUserByLogin(userLogin: string) {
    const response = await this.authSqlRepository.getUserByLoginOrEmail(userLogin)

    return response
  }
}

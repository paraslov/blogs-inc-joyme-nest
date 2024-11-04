import { INestApplication } from '@nestjs/common'

export class AuthTestManager {
  constructor(protected readonly app: INestApplication) {}
  httpSever = this.app.getHttpServer()

  getRefreshTokenFromResponseCookies = (cookies: string[]) => {
    const refreshCookie = cookies.find((cookie: string) => cookie.includes('refreshToken'))

    return refreshCookie?.slice(13)?.split(';')?.[0] ?? null
  }
}

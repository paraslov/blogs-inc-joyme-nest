import { INestApplication } from '@nestjs/common'

export class AuthTestManager {
  constructor(protected readonly app: INestApplication) {}

  getRefreshTokenFromResponseCookies = (cookies: string | string[]) => {
    if (typeof cookies === 'string') {
      cookies = [cookies]
    }

    const refreshCookie = cookies.find((cookie: string) => cookie.includes('refreshToken'))

    return refreshCookie?.slice(13)?.split(';')?.[0] ?? null
  }
}

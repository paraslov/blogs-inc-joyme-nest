import jwt, { JwtPayload } from 'jsonwebtoken'
import { appSettings } from '../../settings/app.settings'

const jwtConfig = {
  access: { secret: appSettings.api.ACCESS_JWT_SECRET, expires: appSettings.api.ACCESS_JWT_EXPIRES },
  refresh: { secret: appSettings.api.REFRESH_JWT_SECRET, expires: appSettings.api.REFRESH_JWT_EXPIRES },
}

export class JwtService {
  async createAccessToken(userId: string) {
    if (!jwtConfig.access.secret) {
      return null
    }

    return jwt.sign({ userId }, jwtConfig.access.secret, { expiresIn: jwtConfig.access.expires })
  }
  async createRefreshToken(userId: string, deviceId: string) {
    if (!jwtConfig.refresh.secret) {
      return null
    }

    return jwt.sign({ userId, deviceId }, jwtConfig.refresh.secret, {
      expiresIn: jwtConfig.refresh.expires,
    })
  }
  async createTokenPair(userId: string, deviceId: string) {
    const accessToken = await this.createAccessToken(userId)
    const refreshToken = await this.createRefreshToken(userId, deviceId)

    return { accessToken, refreshToken }
  }
  async getUserIdByToken(token: string, secretType: 'access' | 'refresh' = 'access'): Promise<string | null> {
    const secret = secretType === 'access' ? jwtConfig.access.secret : jwtConfig.refresh.secret

    if (!secret) {
      return null
    }

    try {
      const res: any = jwt.verify(token, secret)

      return res.userId
    } catch (err) {
      return null
    }
  }
  async getDataByTokenAndVerify(
    token: string,
    secretType: 'access' | 'refresh' = 'access',
  ): Promise<JwtPayload | null> {
    const secret = secretType === 'access' ? jwtConfig.access.secret : jwtConfig.refresh.secret

    if (!secret) {
      return null
    }

    try {
      const res = jwt.verify(token, secret)

      if (typeof res === 'string') {
        return null
      }

      return res
    } catch (err) {
      return null
    }
  }
  async decodeToken(token: string) {
    const tokenData = jwt.decode(token)

    if (!tokenData || typeof tokenData === 'string') {
      return null
    }

    return tokenData
  }
}

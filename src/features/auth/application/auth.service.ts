import { Injectable } from '@nestjs/common'
import { CryptService } from '../../../common/services'
import { JwtService } from '@nestjs/jwt'
import { AuthStrategiesDto } from '../api/models/utility/auth-strategies-dto'
import { ConfigService } from '@nestjs/config'
import { ConfigurationType } from '../../../settings/configuration'
import { AuthRepository } from '../infrastructure/auth.repository.service'

@Injectable()
export class AuthService {
  constructor(
    private authRepository: AuthRepository,
    private cryptService: CryptService,
    private jwtService: JwtService,
    private readonly configService: ConfigService<ConfigurationType>,
  ) {}

  async validateUser(username: string, password: string): Promise<AuthStrategiesDto | null> {
    const userData = await this.authRepository.getUserByLoginOrEmail(username)
    if (!userData) {
      return null
    }

    const isPasswordValid = await this.cryptService.checkPassword(password, userData.user.password_hash)

    if (!isPasswordValid) {
      return null
    }

    return { username: userData.user.login, sub: userData.user.id }
  }

  async getTokens(payload: AuthStrategiesDto, deviceId: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload),
      this.jwtService.signAsync(
        { ...payload, deviceId },
        {
          secret: this.configService.get('jwtSettings').REFRESH_JWT_SECRET,
          expiresIn: this.configService.get('jwtSettings').REFRESH_JWT_EXPIRES,
        },
      ),
    ])

    return {
      accessToken,
      refreshToken,
    }
  }
}

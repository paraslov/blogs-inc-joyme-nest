import { Injectable } from '@nestjs/common'
import { CryptService } from '../../../common/services'
import { JwtService } from '@nestjs/jwt'
import { AuthStrategiesDto } from '../api/models/utility/auth-strategies-dto'
import { AuthRepository } from '../infrastructure/auth.repository'
import { ConfigService } from '@nestjs/config'
import { ConfigurationType } from '../../../settings/configuration'

@Injectable()
export class AuthService {
  constructor(
    private authRepository: AuthRepository,
    private cryptService: CryptService,
    private jwtService: JwtService,
    private readonly configService: ConfigService<ConfigurationType>,
  ) {}

  async validateUser(username: string, password: string): Promise<AuthStrategiesDto | null> {
    const user = await this.authRepository.getUserByLoginOrEmail(username)
    if (!user) {
      return null
    }

    const isPasswordValid = await this.cryptService.checkPassword(password, user.userData.passwordHash)

    if (!isPasswordValid) {
      return null
    }

    return { username: user.userData.login, sub: user._id.toString() }
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

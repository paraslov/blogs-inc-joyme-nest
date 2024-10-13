import { Injectable } from '@nestjs/common'
import { CryptService } from '../../../common/services'
import { JwtService } from '@nestjs/jwt'
import { AuthStrategiesDto } from '../api/models/utility/auth-strategies-dto'
import { AuthRepository } from '../infrastructure/auth.repository'

@Injectable()
export class AuthService {
  constructor(
    private authRepository: AuthRepository,
    private cryptService: CryptService,
    private jwtService: JwtService,
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

  async login(payload: AuthStrategiesDto) {
    return {
      accessToken: this.jwtService.sign(payload),
      refreshToken: 'refresh_token',
    }
  }
}

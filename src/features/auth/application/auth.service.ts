import { Injectable } from '@nestjs/common'
import { CryptService } from '../../../common/services'
import { JwtService } from '@nestjs/jwt'
import { AuthStrategiesDto } from '../api/models/utility/auth-strategies-dto'
import { AuthRepository } from '../infrastructure/auth.repository'

const REFRESH_TOKEN =
  // eslint-disable-next-line max-len
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im5ld1VzZXIxIiwic3ViIjoiNjcwYjRiNDEzNjYwNjg4OWQ4NDBhODhiIiwiaWF0IjoxNzI5NjEzODEzLCJleHAiOjE3Mjk2MTQxMTN9.-HG3EeneipJqGMX24zmYvcU_X8oDoqS4WLZJjAklCpE'

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
      refreshToken: REFRESH_TOKEN,
    }
  }
}

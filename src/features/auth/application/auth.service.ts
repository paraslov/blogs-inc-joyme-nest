import { Injectable } from '@nestjs/common'
import { UsersQueryRepository } from '../../users/infrastructure/users.query-repository'
import { CryptService } from '../../../common/services'
import { JwtService } from '@nestjs/jwt'
import { AuthStrategiesDto } from '../api/models/utility/auth-strategies-dto'

@Injectable()
export class AuthService {
  constructor(
    private usersQueryRepository: UsersQueryRepository,
    private cryptService: CryptService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<AuthStrategiesDto | null> {
    const user = await this.usersQueryRepository.getUserByLoginOrEmail(username)
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
      access_token: this.jwtService.sign(payload),
    }
  }
}

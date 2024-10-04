import { Strategy } from 'passport-local'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { AuthService } from '../auth.service'
import { AuthStrategiesDto } from '../../api/models/utility/auth-strategies-dto'

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'loginOrEmail', passwordField: 'password' })
  }

  async validate(username: string, password: string): Promise<AuthStrategiesDto> {
    const userAuthData = await this.authService.validateUser(username, password)

    if (!userAuthData) {
      throw new UnauthorizedException()
    }

    return userAuthData
  }
}

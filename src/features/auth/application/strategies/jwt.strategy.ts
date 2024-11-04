import { ExtractJwt, Strategy } from 'passport-jwt'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ConfigurationType } from '../../../../settings/configuration'
import { AuthStrategiesDto } from '../../api/models/utility/auth-strategies-dto'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService<ConfigurationType>) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('jwtSettings').ACCESS_JWT_SECRET,
    })
  }

  async validate(payload: AuthStrategiesDto) {
    return { userId: payload.sub, username: payload.username }
  }
}

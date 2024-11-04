import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { Request } from 'express'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ConfigurationType } from '../../../../settings/configuration'
import { AuthStrategiesDto } from '../../api/models/utility/auth-strategies-dto'

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(private readonly configService: ConfigService<ConfigurationType>) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('jwtSettings').REFRESH_JWT_SECRET,
      passReqToCallback: true,
      ignoreExpiration: false,
    })
  }

  validate(req: Request, payload: AuthStrategiesDto) {
    const refreshToken = req.get('Authorization').replace('Bearer', '').trim()
    console.log('@> refreshToken: ', refreshToken)
    console.log('@> payload: ', payload)

    return { userId: payload.sub, username: payload.username, refreshToken }
  }
}

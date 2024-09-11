import { ExtractJwt, Strategy } from 'passport-jwt'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable } from '@nestjs/common'
import { appSettings } from '../../../../settings/app.settings'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: appSettings.api.ACCESS_JWT_SECRET,
    })
  }

  async validate(payload: any) {
    return { userId: payload.sub, username: payload.username }
  }
}

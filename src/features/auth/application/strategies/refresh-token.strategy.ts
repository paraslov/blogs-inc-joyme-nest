import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { Request } from 'express'
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ConfigurationType } from '../../../../settings/configuration'
import { AuthStrategiesDto } from '../../api/models/utility/auth-strategies-dto'
import { JwtOperationsService } from '../../../../common/services'
import { DevicesSqlRepository } from '../../../devices'

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(
    private configService: ConfigService<ConfigurationType>,
    private devicesRepository: DevicesSqlRepository,
    private jwtOperationsService: JwtOperationsService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request?.cookies?.['refreshToken'] ?? null
        },
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      secretOrKey: configService.get('jwtSettings').REFRESH_JWT_SECRET,
      passReqToCallback: true,
      ignoreExpiration: false,
    })
  }

  async validate(req: Request, payload: AuthStrategiesDto) {
    const refreshToken = req?.cookies?.['refreshToken'] ?? null
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token not found')
    }

    const decodedData = this.jwtOperationsService.decodeRefreshToken(refreshToken)
    const device = await this.devicesRepository.getDeviceById(decodedData.deviceId)

    if (!device || device.iat !== decodedData.iat) {
      throw new UnauthorizedException('Refresh token expired')
    }

    return { userId: payload.sub, username: payload.username, refreshToken }
  }
}

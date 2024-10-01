import { BasicStrategy as Strategy } from 'passport-http'
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ConfigService } from '@nestjs/config'
import { ConfigurationType } from '../../../../settings/configuration'

@Injectable()
export class SaStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService<ConfigurationType>) {
    super()
  }

  public validate = async (username: string, password: string): Promise<boolean> => {
    const jwtSettings = this.configService.get('jwtSettings', { infer: true })

    if (jwtSettings.SA_USER_USERNAME === username && jwtSettings.SA_USER_PASSWORD === password) {
      return true
    }

    throw new UnauthorizedException()
  }
}

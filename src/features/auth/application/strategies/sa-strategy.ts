import { BasicStrategy as Strategy } from 'passport-http'
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { appSettings } from '../../../../settings/app.settings'

@Injectable()
export class SaStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super()
  }

  public validate = async (username: string, password: string): Promise<boolean> => {
    if (appSettings.api.SA_USER_USERNAME === username && appSettings.api.SA_USER_PASSWORD === password) {
      return true
    }

    throw new UnauthorizedException()
  }
}

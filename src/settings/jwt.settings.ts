import { EnvironmentVariable } from './configuration'
import { TrimmedString } from '../base/decorators'

export class JwtSettings {
  constructor(private environmentVariables: EnvironmentVariable) {}

  @TrimmedString()
  public readonly ACCESS_JWT_SECRET: string = this.environmentVariables.ACCESS_JWT_SECRET
  @TrimmedString()
  public readonly ACCESS_JWT_EXPIRES: string = this.environmentVariables.ACCESS_JWT_EXPIRES
  @TrimmedString()
  public readonly REFRESH_JWT_SECRET: string = this.environmentVariables.REFRESH_JWT_SECRET
  @TrimmedString()
  public readonly REFRESH_JWT_EXPIRES: string = this.environmentVariables.REFRESH_JWT_EXPIRES
  @TrimmedString()
  public readonly SA_USER_USERNAME: string = this.environmentVariables.SA_USER_USERNAME
  @TrimmedString()
  public readonly SA_USER_PASSWORD: string = this.environmentVariables.SA_USER_PASSWORD
}

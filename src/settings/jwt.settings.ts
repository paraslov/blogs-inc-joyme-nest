import { EnvironmentVariable } from './configuration'
import { IsString } from 'class-validator'

export class JwtSettings {
  constructor(private environmentVariables: EnvironmentVariable) {}

  @IsString()
  public readonly ACCESS_JWT_SECRET: string = this.environmentVariables.ACCESS_JWT_SECRET
  @IsString()
  public readonly ACCESS_JWT_EXPIRES: string = this.environmentVariables.ACCESS_JWT_EXPIRES
  @IsString()
  public readonly REFRESH_JWT_SECRET: string = this.environmentVariables.REFRESH_JWT_SECRET
  @IsString()
  public readonly REFRESH_JWT_EXPIRES: string = this.environmentVariables.REFRESH_JWT_EXPIRES
  @IsString()
  public readonly SA_USER_USERNAME: string = this.environmentVariables.SA_USER_USERNAME
  @IsString()
  public readonly SA_USER_PASSWORD: string = this.environmentVariables.SA_USER_PASSWORD
}

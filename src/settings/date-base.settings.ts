import { EnvironmentVariable } from './configuration'
import { TrimmedString } from '../base/decorators'

export class DatabaseSettings {
  constructor(private environmentVariables: EnvironmentVariable) {}

  @TrimmedString()
  public readonly POSTGRES_DATABASE: string = this.environmentVariables.POSTGRES_DATABASE
  @TrimmedString()
  public readonly POSTGRES_USER_NAME: string = this.environmentVariables.POSTGRES_USER_NAME
  @TrimmedString()
  public readonly POSTGRES_USER_PASSWORD: string = this.environmentVariables.POSTGRES_USER_PASSWORD
  @TrimmedString()
  public readonly POSTGRES_HOST: string = this.environmentVariables.POSTGRES_HOST
  @TrimmedString()
  public readonly POSTGRES_PORT: string = this.environmentVariables.POSTGRES_PORT
}

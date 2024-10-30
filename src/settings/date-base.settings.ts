import { EnvironmentVariable } from './configuration'
import { TrimmedString } from '../base/decorators'

export class DatabaseSettings {
  constructor(private environmentVariables: EnvironmentVariable) {}

  @TrimmedString()
  public readonly MONGO_CONNECTION_URI: string = this.environmentVariables.MONGO_CONNECTION_URI
  @TrimmedString()
  public readonly DB_NAME: string = this.environmentVariables.MONGO_DB_NAME
}

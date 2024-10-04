import { IsString } from 'class-validator'
import { EnvironmentVariable } from './configuration'

export class DatabaseSettings {
  constructor(private environmentVariables: EnvironmentVariable) {}

  @IsString()
  public readonly MONGO_CONNECTION_URI: string = this.environmentVariables.MONGO_CONNECTION_URI
  @IsString()
  public readonly DB_NAME: string = this.environmentVariables.MONGO_DB_NAME
}

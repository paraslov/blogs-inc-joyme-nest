import { IsNumber } from 'class-validator'
import { EnvironmentVariable } from './configuration'

export class ApiSettings {
  constructor(private environmentVariables: EnvironmentVariable) {}
  @IsNumber()
  public readonly APP_PORT: number = Number(this.environmentVariables.PORT) || 3000
}

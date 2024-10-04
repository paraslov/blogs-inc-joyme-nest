import { IsNumber } from 'class-validator'
import { EnvironmentVariable } from './configuration'

export class ApiSettings {
  constructor(private environmentVariables: EnvironmentVariable) {}
  @IsNumber()
  public readonly APP_PORT: number = Number(this.environmentVariables.APP_PORT) || 3000
}

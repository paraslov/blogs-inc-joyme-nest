import { EnvironmentVariable } from './configuration'
import { IsEnum } from 'class-validator'

export enum Environments {
  DEVELOPMENT = 'development',
  STAGING = 'staging',
  PRODUCTION = 'production',
  TEST = 'test',
}

export class EnvironmentSettings {
  constructor(private environmentVariables: EnvironmentVariable) {}
  @IsEnum(Environments)
  private ENV = this.environmentVariables.ENV
  get isProduction() {
    return this.environmentVariables.ENV === Environments.PRODUCTION
  }
  get isStaging() {
    return this.environmentVariables.ENV === Environments.STAGING
  }
  get isTesting() {
    return this.environmentVariables.ENV === Environments.TEST
  }
  get isDevelopment() {
    return this.environmentVariables.ENV === Environments.DEVELOPMENT
  }
  get currentEnv() {
    return this.ENV
  }
}

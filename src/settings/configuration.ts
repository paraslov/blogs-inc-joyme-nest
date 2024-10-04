import { ValidateNested, validateSync } from 'class-validator'
import { ApiSettings } from './api.settings'
import { DatabaseSettings } from './date-base.settings'
import { EnvironmentSettings } from './env.settings'
import { JwtSettings } from './jwt.settings'
import { MailerSettings } from './mailer.settings'

export type EnvironmentVariable = { [key: string]: string }
export type ConfigurationType = Configuration
export type ApiSettingsType = ConfigurationType['apiSettings']
export type DatabaseSettingsType = ConfigurationType['databaseSettings']
export type JwtSettingsType = ConfigurationType['jwtSettings']
export type MailerSettingsType = ConfigurationType['mailerSettings']
export type EnvironmentSettingsType = ConfigurationType['environmentSettings']

export class Configuration {
  @ValidateNested()
  apiSettings: ApiSettings
  @ValidateNested()
  databaseSettings: DatabaseSettings
  @ValidateNested()
  jwtSettings: JwtSettings
  @ValidateNested()
  mailerSettings: MailerSettings
  @ValidateNested()
  environmentSettings: EnvironmentSettings

  private constructor(configuration: Configuration) {
    Object.assign(this, configuration)
  }

  static createConfig(environmentVariables: Record<string, string>): Configuration {
    return new this({
      apiSettings: new ApiSettings(environmentVariables),
      databaseSettings: new DatabaseSettings(environmentVariables),
      environmentSettings: new EnvironmentSettings(environmentVariables),
      jwtSettings: new JwtSettings(environmentVariables),
      mailerSettings: new MailerSettings(environmentVariables),
    })
  }
}

export function validate(environmentVariables: Record<string, string>) {
  const config = Configuration.createConfig(environmentVariables)
  const errors = validateSync(config, { skipMissingProperties: false })

  if (errors.length > 0) {
    throw new Error(errors.toString())
  }

  return config
}

export default () => {
  const environmentVariables = process.env as EnvironmentVariable
  console.log('process.env.ENV =', environmentVariables.ENV)

  return Configuration.createConfig(environmentVariables)
}

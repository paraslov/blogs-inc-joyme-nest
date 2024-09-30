import { EnvironmentVariable } from './configuration'
import { IsString } from 'class-validator'

export class MailerSettings {
  constructor(private environmentVariables: EnvironmentVariable) {}

  @IsString()
  public readonly SEND_MAIL_SERVICE_EMAIL = this.environmentVariables.SEND_MAIL_SERVICE_EMAIL
  @IsString()
  public readonly SEND_MAIL_SERVICE_PASSWORD = this.environmentVariables.SEND_MAIL_SERVICE_PASSWORD
}

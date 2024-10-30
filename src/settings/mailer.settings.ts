import { EnvironmentVariable } from './configuration'
import { TrimmedString } from '../base/decorators'

export class MailerSettings {
  constructor(private environmentVariables: EnvironmentVariable) {}

  @TrimmedString()
  public readonly SEND_MAIL_SERVICE_EMAIL = this.environmentVariables.SEND_MAIL_SERVICE_EMAIL
  @TrimmedString()
  public readonly SEND_MAIL_SERVICE_PASSWORD = this.environmentVariables.SEND_MAIL_SERVICE_PASSWORD
}

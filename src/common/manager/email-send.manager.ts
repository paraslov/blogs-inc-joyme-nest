import { Injectable } from '@nestjs/common'
import { MailerService } from '../services'
import { EmailTemplatesManager } from './email-templates.manager'

@Injectable()
export class EmailSendManager {
  constructor(
    private readonly mailerService: MailerService,
    private readonly emailTemplatesManager: EmailTemplatesManager,
  ) {}

  async sendRegistrationEmail(email: string, confirmationCode: string) {
    const emailTemplate = this.emailTemplatesManager.getRegistrationMailTemplate(email, confirmationCode)

    return await this.mailerService.sendEmail(emailTemplate)
  }
  async resendRegistrationEmail(email: string, confirmationCode: string) {
    const emailTemplate = this.emailTemplatesManager.getResendRegistrationMailTemplate(email, confirmationCode)

    return await this.mailerService.sendEmail(emailTemplate)
  }
  async sendPasswordRecoveryEmail(email: string, confirmationCode: string) {
    const emailTemplate = this.emailTemplatesManager.getPasswordRecoveryMailTemplate(email, confirmationCode)

    return await this.mailerService.sendEmail(emailTemplate)
  }
}

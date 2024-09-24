import nodemailer from 'nodemailer'
import { MailOptions } from 'nodemailer/lib/sendmail-transport'
import { appSettings } from '../../settings/app.settings'
import { Injectable } from '@nestjs/common'

@Injectable()
export class MailerService {
  private readonly transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: appSettings.api.SEND_MAIL_SERVICE_EMAIL,
      pass: appSettings.api.SEND_MAIL_SERVICE_PASSWORD,
    },
  })

  async sendEmail(emailTemplate: MailOptions) {
    const info = await this.transporter.sendMail(emailTemplate)

    return info
  }
}

import nodemailer from 'nodemailer'
import { MailOptions } from 'nodemailer/lib/sendmail-transport'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ConfigurationType } from '../../settings/configuration'

@Injectable()
export class MailerService {
  constructor(private readonly configService: ConfigService<ConfigurationType>) {}

  private readonly transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: this.configService.get('mailerSettings').SEND_MAIL_SERVICE_EMAIL,
      pass: this.configService.get('mailerSettings').SEND_MAIL_SERVICE_PASSWORD,
    },
  })

  async sendEmail(emailTemplate: MailOptions) {
    const info = await this.transporter.sendMail(emailTemplate)

    return info
  }
}

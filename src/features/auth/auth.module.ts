import { Module } from '@nestjs/common'
import { AuthService } from './application/auth.service'
import { CryptService, MailerService } from '../../common/services'
import { AuthController } from './api/auth.controller'
import { PassportModule } from '@nestjs/passport'
import { UsersModule } from '../users/users.module'
import { JwtModule } from '@nestjs/jwt'
import { appSettings } from '../../settings/app.settings'
import { strategies } from './application/strategies'
import { AuthCommandService } from './application/auth.command.service'
import { authCommandHandlers } from './application/commands'
import { CqrsModule } from '@nestjs/cqrs'
import { EmailSendManager } from '../../common/manager/email-send.manager'
import { EmailTemplatesManager } from '../../common/manager'

@Module({
  imports: [
    PassportModule,
    UsersModule,
    CqrsModule,
    JwtModule.register({
      secret: appSettings.api.ACCESS_JWT_SECRET,
      signOptions: { expiresIn: appSettings.api.ACCESS_JWT_EXPIRES },
    }),
  ],
  exports: [],
  controllers: [AuthController],
  providers: [
    AuthService,
    AuthCommandService,
    CryptService,
    EmailSendManager,
    MailerService,
    EmailTemplatesManager,
    ...strategies,
    ...authCommandHandlers,
  ],
})
export class AuthModule {}

import { Module } from '@nestjs/common'
import { AuthService } from './application/auth.service'
import { CryptService, MailerService } from '../../common/services'
import { AuthController } from './api/auth.controller'
import { PassportModule } from '@nestjs/passport'
import { UsersModule } from '../users/users.module'
import { JwtModule } from '@nestjs/jwt'
import { strategies } from './application/strategies'
import { AuthCommandService } from './application/auth.command.service'
import { authCommandHandlers } from './application/commands'
import { CqrsModule } from '@nestjs/cqrs'
import { EmailSendManager } from '../../common/manager'
import { EmailTemplatesManager } from '../../common/manager'
import { ConfigService } from '@nestjs/config'
import { ConfigurationType } from '../../settings/configuration'
import { AuthRepository } from './infrastructure/auth.repository'

@Module({
  imports: [
    PassportModule,
    UsersModule,
    CqrsModule,
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService<ConfigurationType>) => ({
        secret: configService.get('jwtSettings').ACCESS_JWT_SECRET,
        signOptions: { expiresIn: configService.get('jwtSettings').ACCESS_JWT_EXPIRES },
      }),
      inject: [ConfigService],
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
    AuthRepository,
    ...strategies,
    ...authCommandHandlers,
  ],
})
export class AuthModule {}

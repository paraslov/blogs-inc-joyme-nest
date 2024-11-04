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
import { EmailSendManager, EmailTemplatesManager } from '../../common/manager'
import { ConfigService } from '@nestjs/config'
import { ConfigurationType } from '../../settings/configuration'
import { AuthRepository } from './infrastructure/auth.repository'
import { AuthQueryRepository } from './infrastructure/auth.query-repository'
import { AuthMappers } from './infrastructure/auth.mappers'
import { DevicesModule } from '../devices'

@Module({
  imports: [
    PassportModule,
    UsersModule,
    DevicesModule,
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
    AuthQueryRepository,
    AuthMappers,
    ...strategies,
    ...authCommandHandlers,
  ],
})
export class AuthModule {}

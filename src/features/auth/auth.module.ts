import { Module } from '@nestjs/common'
import { UsersMongooseModule } from '../users/domain/mongoose/users.entity'
import { AuthService } from './application/auth.service'
import { CryptService } from '../../common/services'
import { AuthController } from './api/auth.controller'
import { PassportModule } from '@nestjs/passport'
import { UsersModule } from '../users/users.module'
import { JwtModule, JwtService } from '@nestjs/jwt'
import { appSettings } from '../../settings/app.settings'
import { strategies } from './application/strategies'

@Module({
  imports: [
    UsersMongooseModule,
    PassportModule,
    UsersModule,
    JwtModule.register({
      secret: appSettings.api.ACCESS_JWT_SECRET,
      signOptions: { expiresIn: appSettings.api.ACCESS_JWT_EXPIRES },
    }),
  ],
  exports: [],
  controllers: [AuthController],
  providers: [AuthService, CryptService, ...strategies],
})
export class AuthModule {}

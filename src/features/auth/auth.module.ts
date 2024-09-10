import { Module } from '@nestjs/common'
import { UsersMongooseModule } from '../users/domain/mongoose/users.entity'
import { AuthService } from './application/auth.service'
import { CryptService, JwtService } from '../../common/services'
import { AuthController } from './api/auth.controller'
import { PassportModule } from '@nestjs/passport'
import { LocalStrategy } from './application/strategies/local.strategy'
import { LocalAuthGuard } from '../../base/guards/LocalAuth.guard'
import { UsersModule } from '../users/users.module'

@Module({
  imports: [UsersMongooseModule, PassportModule, UsersModule],
  exports: [AuthService, LocalStrategy],
  controllers: [AuthController],
  providers: [AuthService, CryptService, JwtService, LocalStrategy, LocalAuthGuard],
})
export class AuthModule {}

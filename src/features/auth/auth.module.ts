import { Module } from '@nestjs/common'
import { UsersMongooseModule } from '../users/domain/mongoose/users.entity'
import { AuthService } from './application/auth.service'
import { CryptService, JwtService } from '../../common/services'
import { AuthController } from './api/auth.controller'

@Module({
  imports: [UsersMongooseModule],
  exports: [],
  controllers: [AuthController],
  providers: [AuthService, CryptService, JwtService],
})
export class AuthModule {}

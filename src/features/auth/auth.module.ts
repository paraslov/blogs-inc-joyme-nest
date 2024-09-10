import { Module } from '@nestjs/common'
import { UsersMongooseModule } from '../users/domain/mongoose/users.entity'
import { AuthService } from './application/auth.service'
import { CryptService } from '../../common/services'
import { AuthController } from './api/auth.controller'

@Module({
  imports: [UsersMongooseModule],
  exports: [],
  controllers: [AuthController],
  providers: [AuthService, CryptService],
})
export class AuthModule {}

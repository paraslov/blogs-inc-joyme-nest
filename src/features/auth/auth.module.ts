import { Module } from '@nestjs/common'
import { UsersMongooseModule } from '../users/domain/mongoose/users.entity'
import { AuthService } from './application/auth.service'

@Module({
  imports: [UsersMongooseModule],
  exports: [],
  controllers: [],
  providers: [AuthService],
})
export class AuthModule {}

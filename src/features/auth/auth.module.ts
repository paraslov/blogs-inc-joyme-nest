import { Module } from '@nestjs/common'
import { UsersMongooseModule } from '../users/domain/mongoose/users.entity'

@Module({
  imports: [UsersMongooseModule],
  exports: [],
  controllers: [],
  providers: [],
})
export class AuthModule {}

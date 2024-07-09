import { Module } from '@nestjs/common'
import { UsersMongooseModule } from './domain/mongoose/users.entity'

@Module({
  imports: [UsersMongooseModule],
  exports: [UsersMongooseModule],
  controllers: [],
  providers: [],
})
export class UsersModule {}

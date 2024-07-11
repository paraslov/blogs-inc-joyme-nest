import { Module } from '@nestjs/common'
import { UsersMongooseModule } from './domain/mongoose/users.entity'
import { UsersController } from './api/users.controller'

@Module({
  imports: [UsersMongooseModule],
  exports: [UsersMongooseModule],
  controllers: [UsersController],
  providers: [],
})
export class UsersModule {}

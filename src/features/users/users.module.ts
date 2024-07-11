import { Module } from '@nestjs/common'
import { UsersMongooseModule } from './domain/mongoose/users.entity'
import { UsersController } from './api/users.controller'
import { UsersService } from './application/users.service'
import { UsersRepository } from './infrastructure/users.repository'
import { UsersQueryRepository } from './infrastructure/users.query-repository'
import { UsersMappers } from './infrastructure/users.mappers'

@Module({
  imports: [UsersMongooseModule],
  exports: [UsersMongooseModule],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository, UsersQueryRepository, UsersMappers],
})
export class UsersModule {}

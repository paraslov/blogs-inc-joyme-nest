import { Module } from '@nestjs/common'
import { UsersMongooseModule } from './domain/mongoose/users.entity'
import { UsersController } from './api/users.controller'
import { UsersRepository } from './infrastructure/users.repository'
import { UsersQueryRepository } from './infrastructure/users.query-repository'
import { UsersMappers } from './infrastructure/users.mappers'
import { CryptService } from '../../common/services'
import { usersCommandHandlers } from './application/commands'
import { UsersCommandService } from './application/users.command.service'
import { CqrsModule } from '@nestjs/cqrs'
import { UsersSqlQueryRepository } from './infrastructure/users.sql-query-repository'
import { UsersSqlRepository } from './infrastructure/users.sql-repository'

@Module({
  imports: [UsersMongooseModule, CqrsModule],
  exports: [UsersMongooseModule, UsersRepository, UsersQueryRepository],
  controllers: [UsersController],
  providers: [
    UsersCommandService,
    UsersRepository,
    UsersQueryRepository,
    UsersMappers,
    UsersSqlQueryRepository,
    UsersSqlRepository,
    CryptService,
    ...usersCommandHandlers,
  ],
})
export class UsersModule {}

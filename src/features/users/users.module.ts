import { Module } from '@nestjs/common'
import { UsersController } from './api/users.controller'
import { UsersMappers } from './infrastructure/users.mappers'
import { CryptService } from '../../common/services'
import { usersCommandHandlers } from './application/commands'
import { UsersCommandService } from './application/users.command.service'
import { CqrsModule } from '@nestjs/cqrs'
import { UsersSqlQueryRepository } from './infrastructure/users.sql-query-repository'
import { UsersSqlRepository } from './infrastructure/users.sql-repository'

@Module({
  imports: [CqrsModule],
  exports: [UsersSqlRepository, UsersSqlQueryRepository],
  controllers: [UsersController],
  providers: [
    UsersCommandService,
    UsersMappers,
    UsersSqlQueryRepository,
    UsersSqlRepository,
    CryptService,
    ...usersCommandHandlers,
  ],
})
export class UsersModule {}

import { Module } from '@nestjs/common'
import { UsersController } from './api/users.controller'
import { UsersMappers } from './infrastructure/users.mappers'
import { CryptService } from '../../common/services'
import { usersCommandHandlers } from './application/commands'
import { UsersCommandService } from './application/users.command.service'
import { CqrsModule } from '@nestjs/cqrs'
import { UsersQueryRepository } from './infrastructure/users.query-repository'
import { UsersRepository } from './infrastructure/users.repository.service'

@Module({
  imports: [CqrsModule],
  exports: [UsersRepository, UsersQueryRepository],
  controllers: [UsersController],
  providers: [
    UsersCommandService,
    UsersMappers,
    UsersQueryRepository,
    UsersRepository,
    CryptService,
    ...usersCommandHandlers,
  ],
})
export class UsersModule {}

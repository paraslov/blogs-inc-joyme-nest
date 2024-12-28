import { Module } from '@nestjs/common'
import { UsersController } from './api/users.controller'
import { UsersMappers } from './infrastructure/users.mappers'
import { CryptService } from '../../common/services'
import { usersCommandHandlers } from './application/commands'
import { UsersCommandService } from './application/users.command.service'
import { CqrsModule } from '@nestjs/cqrs'
import { UsersQueryRepository } from './infrastructure/users.query-repository'
import { UsersRepository } from './infrastructure/users.repository'
import { UserEntity } from './domain/postgres/user.entity'
import { UserInfoEntity } from './domain/postgres/user-info.entity'
import { TypeOrmModule } from '@nestjs/typeorm'

@Module({
  imports: [CqrsModule, TypeOrmModule.forFeature([UserInfoEntity, UserEntity])],
  exports: [UsersRepository, UsersQueryRepository, UserEntity, UserInfoEntity],
  controllers: [UsersController],
  providers: [
    UsersCommandService,
    UsersMappers,
    UsersQueryRepository,
    UsersRepository,
    CryptService,
    UserEntity,
    UserInfoEntity,
    ...usersCommandHandlers,
  ],
})
export class UsersModule {}

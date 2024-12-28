import { Module } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { likesCommandHandlers } from './application/commands'
import { LikesCommandService } from './application/likes.command.service'
import { LikesMappers } from './infrastructure/likes.mappers'
import { LikesRepository } from './infrastructure/likes.repository'
import { LikesEntity } from './domain/postgres/likes.entity'
import { TypeOrmModule } from '@nestjs/typeorm'

@Module({
  imports: [CqrsModule, TypeOrmModule.forFeature([LikesEntity])],
  exports: [LikesCommandService, LikesRepository],
  providers: [LikesCommandService, LikesRepository, LikesMappers, LikesEntity, ...likesCommandHandlers],
})
export class LikesModule {}

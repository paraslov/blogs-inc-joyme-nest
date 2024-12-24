import { Module } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { likesCommandHandlers } from './application/commands'
import { LikesCommandService } from './application/likes.command.service'
import { LikesMappers } from './infrastructure/likes.mappers'
import { LikesRepository } from './infrastructure/likes.repository'
import { LikesDbModel } from './domain/postgres/likes-db-model'
import { TypeOrmModule } from '@nestjs/typeorm'

@Module({
  imports: [CqrsModule, TypeOrmModule.forFeature([LikesDbModel])],
  exports: [LikesCommandService, LikesRepository],
  providers: [LikesCommandService, LikesRepository, LikesMappers, LikesDbModel, ...likesCommandHandlers],
})
export class LikesModule {}

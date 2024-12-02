import { Module } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { LikesMongooseModule } from './domain/mongoose/likes.entity'
import { LikesRepository } from './infrastructure/likes.repository'
import { likesCommandHandlers } from './application/commands'
import { LikesCommandService } from './application/likes.command.service'
import { LikesMappers } from './infrastructure/likes.mappers'
import { LikesSqlRepository } from './infrastructure/likes.sql-repository'

@Module({
  imports: [CqrsModule, LikesMongooseModule],
  exports: [LikesMongooseModule, LikesCommandService, LikesRepository, LikesSqlRepository],
  providers: [LikesCommandService, LikesRepository, LikesSqlRepository, LikesMappers, ...likesCommandHandlers],
})
export class LikesModule {}

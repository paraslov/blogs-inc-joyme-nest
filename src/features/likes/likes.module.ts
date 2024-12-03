import { Module } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { likesCommandHandlers } from './application/commands'
import { LikesCommandService } from './application/likes.command.service'
import { LikesMappers } from './infrastructure/likes.mappers'
import { LikesSqlRepository } from './infrastructure/likes.sql-repository'

@Module({
  imports: [CqrsModule],
  exports: [LikesCommandService, LikesSqlRepository],
  providers: [LikesCommandService, LikesSqlRepository, LikesMappers, ...likesCommandHandlers],
})
export class LikesModule {}

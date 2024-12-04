import { Module } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { likesCommandHandlers } from './application/commands'
import { LikesCommandService } from './application/likes.command.service'
import { LikesMappers } from './infrastructure/likes.mappers'
import { LikesRepository } from './infrastructure/likes.repository'

@Module({
  imports: [CqrsModule],
  exports: [LikesCommandService, LikesRepository],
  providers: [LikesCommandService, LikesRepository, LikesMappers, ...likesCommandHandlers],
})
export class LikesModule {}

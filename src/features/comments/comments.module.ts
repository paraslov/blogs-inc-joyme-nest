import { Module } from '@nestjs/common'
import { CommentsMongooseModule } from './domain/mongoose/comment.entity'
import { CommentsController } from './api/comments.controller'
import { CommentsQueryRepository } from './infrastructure/comments.query-repository'
import { CommentsMappers } from './infrastructure/comments.mappers'
import { CommentsRepository } from './infrastructure/comments.repository'
import { CommentsCommandService } from './application/comments.command.service'
import { CommentsCommandHandlers } from './application/commands'
import { CqrsModule } from '@nestjs/cqrs'

@Module({
  imports: [CommentsMongooseModule, CqrsModule],
  exports: [CommentsMongooseModule, CommentsQueryRepository, CommentsCommandService],
  controllers: [CommentsController],
  providers: [
    CommentsQueryRepository,
    CommentsMappers,
    CommentsRepository,
    CommentsCommandService,
    ...CommentsCommandHandlers,
  ],
})
export class CommentsModule {}

import { Module } from '@nestjs/common'
import { CommentsMongooseModule } from './domain/mongoose/comment.entity'
import { CommentsController } from './api/comments.controller'
import { CommentsQueryRepository } from './infrastructure/comments.query-repository'
import { CommentsMappers } from './infrastructure/comments.mappers'
import { CommentsRepository } from './infrastructure/comments.repository'
import { CommentsCommandService } from './application/comments.command.service'
import { CommentsCommandHandlers } from './application/commands'
import { CqrsModule } from '@nestjs/cqrs'
import { LikesModule } from '../likes/likes.module'
import { UsersModule } from '../users/users.module'
import { CommentsSqlRepository } from './infrastructure/comments.sql-repository'

@Module({
  imports: [CommentsMongooseModule, CqrsModule, LikesModule, UsersModule],
  exports: [CommentsMongooseModule, CommentsQueryRepository, CommentsCommandService],
  controllers: [CommentsController],
  providers: [
    CommentsQueryRepository,
    CommentsMappers,
    CommentsRepository,
    CommentsSqlRepository,
    CommentsCommandService,
    ...CommentsCommandHandlers,
  ],
})
export class CommentsModule {}

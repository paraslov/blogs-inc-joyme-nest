import { Module } from '@nestjs/common'
import { CommentsController } from './api/comments.controller'
import { CommentsQueryRepository } from './infrastructure/comments.query-repository'
import { CommentsMappers } from './infrastructure/comments.mappers'
import { CommentsCommandService } from './application/comments.command.service'
import { CommentsCommandHandlers } from './application/commands'
import { CqrsModule } from '@nestjs/cqrs'
import { LikesModule } from '../likes/likes.module'
import { UsersModule } from '../users/users.module'
import { CommentsRepository } from './infrastructure/comments.repository.service'
import { CommentDbModel } from './domain/postgres/comment-db-model'
import { TypeOrmModule } from '@nestjs/typeorm'

@Module({
  imports: [CqrsModule, LikesModule, UsersModule, TypeOrmModule.forFeature([CommentDbModel])],
  exports: [CommentsQueryRepository, CommentsCommandService],
  controllers: [CommentsController],
  providers: [
    CommentsQueryRepository,
    CommentsMappers,
    CommentsRepository,
    CommentsCommandService,
    CommentDbModel,
    ...CommentsCommandHandlers,
  ],
})
export class CommentsModule {}

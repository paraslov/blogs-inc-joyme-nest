import { Module } from '@nestjs/common'
import { CommentsMongooseModule } from './domain/mongoose/comment.entity'
import { CommentsController } from './api/comments.controller'
import { CommentsQueryRepository } from './infrastructure/comments.query-repository'
import { CommentsMappers } from './infrastructure/comments.mappers'

@Module({
  imports: [CommentsMongooseModule],
  exports: [CommentsMongooseModule, CommentsQueryRepository],
  controllers: [CommentsController],
  providers: [CommentsQueryRepository, CommentsMappers],
})
export class CommentsModule {}

import { CommentsModule } from './comments.module'
import { Comment, CommentsMongooseModule } from './domain/mongoose/comment.entity'
import { CommentsQueryRepository } from './infrastructure/comments.query-repository'
import { CommentsMappers } from './infrastructure/comments.mappers'
import { CreateUpdateCommentDto } from './api/models/input/create-update-comment.dto'
import { CommentsCommandService } from './application/comments.command.service'

export {
  CommentsModule,
  Comment,
  CommentsQueryRepository,
  CommentsMongooseModule,
  CommentsMappers,
  CreateUpdateCommentDto,
  CommentsCommandService,
}

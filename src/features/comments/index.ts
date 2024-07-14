import { CommentsModule } from './comments.module'
import { Comment } from './domain/mongoose/comment.entity'
import { CommentsQueryRepository } from './infrastructure/comments.query-repository'
import { CommentsMongooseModule } from './domain/mongoose/comment.entity'
import { CommentsMappers } from './infrastructure/comments.mappers'

export { CommentsModule, Comment, CommentsQueryRepository, CommentsMongooseModule, CommentsMappers }

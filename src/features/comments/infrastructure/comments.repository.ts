import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Comment } from '../domain/mongoose/comment.entity'
import { Model } from 'mongoose'
import { CommentsMappers } from './comments.mappers'

@Injectable()
export class CommentsRepository {
  constructor(
    @InjectModel(Comment.name) private readonly commentModel: Model<Comment>,
    private readonly commentsMappers: CommentsMappers,
  ) {}

  async saveComment(comment: Comment) {
    const savedComment = await new this.commentModel(comment).save()

    return this.commentsMappers.mapEntityToOutputDto(savedComment)
  }
}

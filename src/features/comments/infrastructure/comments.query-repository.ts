import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Comment } from '../domain/mongoose/comment.entity'
import { Model } from 'mongoose'
import { CommentsMappers } from './comments.mappers'

@Injectable()
export class CommentsQueryRepository {
  constructor(
    @InjectModel(Comment.name) private commentsModel: Model<Comment>,
    private commentsMappers: CommentsMappers,
  ) {}

  async getCommentById(id: string) {
    const foundComment = await this.commentsModel.findById(id)

    return this.commentsMappers.mapEntityToOutputDto(foundComment)
  }
}

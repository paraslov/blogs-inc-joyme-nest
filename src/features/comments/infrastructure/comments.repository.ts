import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { CommentDto } from '../domain/mongoose/comment.entity'
import { Model } from 'mongoose'
import { CommentsMappers } from './comments.mappers'
import { CreateUpdateCommentDto } from '../api/models/input/create-update-comment.dto'

@Injectable()
export class CommentsRepository {
  constructor(
    @InjectModel(CommentDto.name) private readonly commentModel: Model<CommentDto>,
    private readonly commentsMappers: CommentsMappers,
  ) {}

  async updateCommentContent(commentId: string, updateCommentDto: CreateUpdateCommentDto) {
    const updateResult = await this.commentModel.updateOne({ _id: commentId }, { content: updateCommentDto.content })

    return Boolean(updateResult.matchedCount)
  }
  async updateComment(commentId: string, commentDto: CommentDto) {
    const updateResult = await this.commentModel.updateOne({ _id: commentId }, commentDto)

    return Boolean(updateResult.matchedCount)
  }
  async getCommentDBModelById(commentId: string) {
    return this.commentModel.findById(commentId)
  }
  async deleteComment(commentId: string) {
    const result = await this.commentModel.deleteOne({ _id: commentId })

    return Boolean(result.deletedCount)
  }
}

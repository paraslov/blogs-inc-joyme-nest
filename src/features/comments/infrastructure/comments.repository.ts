import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { CommentDto } from '../domain/mongoose/comment.entity'
import { Model } from 'mongoose'

@Injectable()
export class CommentsRepository {
  constructor(@InjectModel(CommentDto.name) private readonly commentModel: Model<CommentDto>) {}

  async updateComment(commentId: string, commentDto: CommentDto) {
    const updateResult = await this.commentModel.updateOne({ _id: commentId }, commentDto)

    return Boolean(updateResult.matchedCount)
  }
  async getCommentDBModelById(commentId: string) {
    return this.commentModel.findById(commentId)
  }
}

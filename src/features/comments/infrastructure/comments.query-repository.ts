import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { CommentDto } from '../domain/mongoose/comment.entity'
import { Model } from 'mongoose'
import { CommentsMappers } from './comments.mappers'
import { StandardInputFilters } from '../../../common/models/input/QueryInputParams'

@Injectable()
export class CommentsQueryRepository {
  constructor(
    @InjectModel(CommentDto.name) private commentsModel: Model<CommentDto>,
    private commentsMappers: CommentsMappers,
  ) {}

  async getCommentById(id: string) {
    const foundComment = await this.commentsModel.findById(id)

    return this.commentsMappers.mapEntityToOutputDto(foundComment)
  }
  async getCommentsList(query: StandardInputFilters, parentId?: string) {
    const { pageNumber, pageSize, sortBy, sortDirection } = query

    let filter = {}
    if (parentId) {
      filter = { parentId }
    }

    const comments = await this.commentsModel
      .find(filter)
      .sort({ [sortBy]: sortDirection === 'asc' ? 1 : -1 })
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .exec()
    const mappedComments = comments.map(this.commentsMappers.mapEntityToOutputDto)

    const totalCount = await this.commentsModel.countDocuments(filter)
    const pagesCount = Math.ceil(totalCount / pageSize)

    return {
      pagesCount,
      totalCount,
      pageSize,
      page: pageNumber,
      items: mappedComments,
    }
  }
}

import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { CommentDto } from '../domain/mongoose/comment.entity'
import { Model } from 'mongoose'
import { CommentsMappers } from './comments.mappers'
import { StandardInputFilters } from '../../../common/models/input/QueryInputParams'
import { LikesRepository } from '../../likes'

@Injectable()
export class CommentsQueryRepository {
  constructor(
    @InjectModel(CommentDto.name) private commentsModel: Model<CommentDto>,
    private likesRepository: LikesRepository,
    private commentsMappers: CommentsMappers,
  ) {}

  async getCommentById(commentId: string, userId?: string) {
    const foundComment = await this.commentsModel.findById(commentId)
    const likeStatus = await this.likesRepository.getUserLikeStatus(commentId, userId)

    return this.commentsMappers.mapEntityToOutputDto(foundComment, likeStatus)
  }
  async getCommentsList(query: StandardInputFilters, parentId?: string, userId?: string) {
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

    const mappedCommentsPromises = comments.map(async (comment) => {
      const likeStatus = await this.likesRepository.getUserLikeStatus(comment.parentId, userId)

      return this.commentsMappers.mapEntityToOutputDto(comment, likeStatus)
    })
    const mappedComments = await Promise.all(mappedCommentsPromises)

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

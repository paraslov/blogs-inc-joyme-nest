import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { CommentDto } from '../domain/mongoose/comment.entity'
import { Model } from 'mongoose'
import { CommentsMappers } from './comments.mappers'
import { LikesRepository } from '../../likes'
import { DataSource } from 'typeorm'
import { CommentSql } from '../domain/postgres/comment-sql'
import { SortDirection } from '../../../common/models/enums/sort-direction'
import { camelToSnakeUtil } from '../../../common/utils'
import { CommentsFilterDto } from '../api/models/input/comments.filter.dto'

@Injectable()
export class CommentsQueryRepository {
  constructor(
    @InjectModel(CommentDto.name) private commentsModel: Model<CommentDto>,
    private likesRepository: LikesRepository,
    private commentsMappers: CommentsMappers,
    private dataSource: DataSource,
  ) {}

  async getCommentById(commentId: string, userId?: string) {
    const foundComment = await this.dataSource.query<CommentSql[]>(
      `
      SELECT id, parent_id, content, created_at, user_id, user_login, likes_count, dislikes_count
        FROM public.comments
        WHERE id=$1;
    `,
      [commentId],
    )
    const likeStatus = await this.likesRepository.getUserLikeStatus(commentId, userId)

    return this.commentsMappers.mapEntityToOutputDto(foundComment?.[0], likeStatus)
  }
  async getCommentsList(query: CommentsFilterDto, parentId?: string, userId?: string) {
    const { pageNumber, pageSize, sortBy, sortDirection } = query
    const offset = (pageNumber - 1) * pageSize
    const direction = sortDirection === SortDirection.DESC ? 'DESC' : 'ASC'
    const sortBySnakeCase = camelToSnakeUtil(sortBy)

    const comments = await this.dataSource.query<CommentSql[]>(
      `
      SELECT id, parent_id, content, created_at, user_id, user_login, likes_count, dislikes_count
        FROM public.comments
        WHERE parent_id=$1
        ORDER BY "${sortBySnakeCase}" ${direction}
        LIMIT $2 OFFSET $3;
    `,
      [parentId, pageSize, offset],
    )
    const totalCountResult = await this.dataSource.query(
      `SELECT COUNT(*) AS "totalCount"
         FROM public.comments
         WHERE parent_id=$1`,
      [parentId],
    )
    const totalCount = parseInt(totalCountResult?.[0]?.totalCount, 10)

    const mappedCommentsPromises = comments.map(async (comment) => {
      const likeStatus = await this.likesRepository.getUserLikeStatus(comment.id, userId)

      return this.commentsMappers.mapEntityToOutputDto(comment as any, likeStatus)
    })
    const mappedComments = await Promise.all(mappedCommentsPromises)

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

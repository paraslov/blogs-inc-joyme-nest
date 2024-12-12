import { Injectable } from '@nestjs/common'
import { CommentsMappers } from './comments.mappers'
import { Repository } from 'typeorm'
import { CommentDbModel } from '../domain/postgres/comment-db-model'
import { SortDirection } from '../../../common/models/enums/sort-direction'
import { camelToSnakeUtil } from '../../../common/utils'
import { CommentsFilterDto } from '../api/models/input/comments.filter.dto'
import { LikesRepository } from '../../likes/infrastructure/likes.repository'
import { InjectRepository } from '@nestjs/typeorm'

@Injectable()
export class CommentsQueryRepository {
  constructor(
    @InjectRepository(CommentDbModel) private commentsOrmRepository: Repository<CommentDbModel>,
    private likesRepository: LikesRepository,
    private commentsMappers: CommentsMappers,
  ) {}

  async getCommentById(commentId: string, userId?: string) {
    const foundComment = await this.commentsOrmRepository
      .createQueryBuilder('c')
      .select([
        'c.id',
        'c.parent_id',
        'c.content',
        'c.created_at',
        'c.user_id',
        'c.user_login',
        'c.likes_count',
        'c.dislikes_count',
      ])
      .where('c.id = :commentId', { commentId })
      .getOne()

    const likeStatus = await this.likesRepository.getUserLikeStatus(commentId, userId)

    return this.commentsMappers.mapEntityToOutputDto(foundComment, likeStatus)
  }

  async getCommentsList(query: CommentsFilterDto, parentId?: string, userId?: string) {
    const { pageNumber, pageSize, sortBy, sortDirection } = query
    const offset = (pageNumber - 1) * pageSize
    const direction = sortDirection === SortDirection.DESC ? 'DESC' : 'ASC'
    const sortBySnakeCase = camelToSnakeUtil(sortBy)

    const [comments, totalCount] = await this.commentsOrmRepository
      .createQueryBuilder('c')
      .select([
        'c.id',
        'c.parent_id',
        'c.content',
        'c.created_at',
        'c.user_id',
        'c.user_login',
        'c.likes_count',
        'c.dislikes_count',
      ])
      .where('c.parent_id = :parentId', { parentId })
      .orderBy(`c.${sortBySnakeCase}`, direction)
      .skip(offset)
      .limit(pageSize)
      .getManyAndCount()

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

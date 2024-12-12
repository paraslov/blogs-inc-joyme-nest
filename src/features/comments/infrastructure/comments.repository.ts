import { Injectable } from '@nestjs/common'
import { Repository } from 'typeorm'
import { CommentDto } from '../domain/business_entity/comment.entity'
import { CreateUpdateCommentDto } from '../api/models/input/create-update-comment.dto'
import { CommentDbModel } from '../domain/postgres/comment-db-model'
import { InjectRepository } from '@nestjs/typeorm'

@Injectable()
export class CommentsRepository {
  constructor(@InjectRepository(CommentDbModel) private commentsOrmRepository: Repository<CommentDbModel>) {}

  async createComment(comment: CommentDto): Promise<string | null> {
    const { parentId, content, createdAt, commentatorInfo, likesCount, dislikesCount } = comment
    const newComment = new CommentDbModel()
    newComment.parent_id = parentId
    newComment.content = content
    newComment.created_at = createdAt
    newComment.likes_count = likesCount
    newComment.dislikes_count = dislikesCount
    newComment.user_id = commentatorInfo.userId
    newComment.user_login = commentatorInfo.userLogin

    const createdCommentResult = await this.commentsOrmRepository.save(newComment)

    return createdCommentResult?.id ?? null
  }

  async updateCommentContent(commentId: string, updateCommentDto: CreateUpdateCommentDto) {
    const updatedComment = new CommentDbModel()
    updatedComment.content = updateCommentDto.content

    const updateResult = await this.commentsOrmRepository.update({ id: commentId }, updatedComment)

    return Boolean(updateResult?.affected)
  }

  async updateComment(commentId: string, commentDto: CommentDto) {
    const { commentatorInfo, likesCount, dislikesCount, createdAt, parentId, content } = commentDto
    const updatedComment = new CommentDbModel()
    updatedComment.parent_id = parentId
    updatedComment.content = content
    updatedComment.created_at = createdAt
    updatedComment.likes_count = likesCount
    updatedComment.dislikes_count = dislikesCount
    updatedComment.user_id = commentatorInfo.userId
    updatedComment.user_login = commentatorInfo.userLogin

    const updateResult = await this.commentsOrmRepository.update({ id: commentId }, updatedComment)

    return Boolean(updateResult?.affected)
  }

  async deleteComment(commentId: string) {
    const deleteResult = await this.commentsOrmRepository.delete({ id: commentId })

    return Boolean(deleteResult?.affected)
  }

  async getCommentDBModelById(commentId: string) {
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

    return foundComment ?? null
  }
}

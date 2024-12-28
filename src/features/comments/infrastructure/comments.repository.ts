import { Injectable } from '@nestjs/common'
import { Repository } from 'typeorm'
import { CommentDto } from '../domain/business_entity/comment'
import { CreateUpdateCommentDto } from '../api/models/input/create-update-comment.dto'
import { CommentEntity } from '../domain/postgres/comment.entity'
import { InjectRepository } from '@nestjs/typeorm'

@Injectable()
export class CommentsRepository {
  constructor(@InjectRepository(CommentEntity) private commentsOrmRepository: Repository<CommentEntity>) {}

  async createComment(comment: CommentDto): Promise<string | null> {
    const newComment = CommentEntity.createCommentModel(comment)

    const createdCommentResult = await this.commentsOrmRepository.save(newComment)
    return createdCommentResult?.id ?? null
  }

  async updateCommentContent(commentId: string, updateCommentDto: CreateUpdateCommentDto) {
    const updatedComment = new CommentEntity()
    updatedComment.content = updateCommentDto.content

    const updateResult = await this.commentsOrmRepository.update({ id: commentId }, updatedComment)
    return Boolean(updateResult?.affected)
  }

  async updateComment(commentId: string, commentDto: CommentDto) {
    const updatedComment = CommentEntity.createCommentModel(commentDto)

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

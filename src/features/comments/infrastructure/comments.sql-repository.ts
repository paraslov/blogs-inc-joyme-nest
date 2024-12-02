import { Injectable } from '@nestjs/common'
import { DataSource } from 'typeorm'
import { CommentDto } from '../domain/mongoose/comment.entity'
import { CreateUpdateCommentDto } from '../api/models/input/create-update-comment.dto'
import { CommentSql } from '../domain/postgres/comment-sql'

@Injectable()
export class CommentsSqlRepository {
  constructor(private dataSource: DataSource) {}
  async createComment(comment: CommentDto): Promise<string | null> {
    const { parentId, content, createdAt, commentatorInfo, likesCount, dislikesCount } = comment
    const createdCommentResult = await this.dataSource.query<{ id: string }[]>(
      `
        INSERT INTO public.comments(
          parent_id, content, created_at, user_id, user_login, likes_count, dislikes_count)
          VALUES ($1, $2, $3, $4, $5, $6, $7)
          RETURNING id;
    `,
      [parentId, content, createdAt, commentatorInfo.userId, commentatorInfo.userLogin, likesCount, dislikesCount],
    )

    return createdCommentResult?.[0]?.id ?? null
  }

  async updateCommentContent(commentId: string, updateCommentDto: CreateUpdateCommentDto) {
    const updateResult = await this.dataSource.query(
      `
      UPDATE public.comments
        SET content=$2
        WHERE id=$1;
    `,
      [commentId, updateCommentDto.content],
    )

    return Boolean(updateResult?.[1])
  }

  async updateComment(commentId: string, commentDto: CommentDto) {
    const { commentatorInfo, likesCount, dislikesCount, createdAt, parentId, content } = commentDto
    const updateResult = await this.dataSource.query(
      `
      UPDATE public.comments
        SET content=$2, parent_id=$3, created_at=$4, user_id=$5, user_login=$6, likes_count=$7, dislikes_count=$8
        WHERE id=$1;
    `,
      [
        commentId,
        content,
        parentId,
        createdAt,
        commentatorInfo.userId,
        commentatorInfo.userLogin,
        likesCount,
        dislikesCount,
      ],
    )

    return Boolean(updateResult.matchedCount)
  }

  async deleteComment(commentId: string) {
    const deleteResult = await this.dataSource.query(
      `
      DELETE FROM public.comments
        WHERE id=$1;
    `,
      [commentId],
    )

    return Boolean(deleteResult?.[1])
  }

  async getCommentDBModelById(commentId: string) {
    const foundComment = await this.dataSource.query<CommentSql[]>(
      `
      SELECT id, parent_id, content, created_at, user_id, user_login, likes_count, dislikes_count
        FROM public.comments
        WHERE id=$1;
    `,
      [commentId],
    )

    return foundComment?.[0]
  }
}

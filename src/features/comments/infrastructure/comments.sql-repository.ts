import { Injectable } from '@nestjs/common'
import { DataSource } from 'typeorm'
import { CommentDto } from '../domain/mongoose/comment.entity'
import { CreateUpdateCommentDto } from '../api/models/input/create-update-comment.dto'

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
}

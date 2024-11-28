import { Injectable } from '@nestjs/common'
import { DataSource } from 'typeorm'
import { CommentDto } from '../domain/mongoose/comment.entity'

@Injectable()
export class CommentsSqlRepository {
  constructor(private dataSource: DataSource) {}

  async createCommentsTable() {
    await this.dataSource.query(`
      CREATE TABLE IF NOT EXISTS public.comments
        (
            id uuid NOT NULL DEFAULT gen_random_uuid(),
            parent_id uuid NOT NULL,
            content character varying(300) NOT NULL,
            created_at timestamp without time zone NOT NULL,
            user_id uuid NOT NULL,
            user_login character varying(10) NOT NULL,
            likes_count integer,
            dislikes_count integer,
            PRIMARY KEY (id)
        );

      ALTER TABLE IF EXISTS public.comments
          OWNER to sa_sql_user;
    `)
  }

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
}

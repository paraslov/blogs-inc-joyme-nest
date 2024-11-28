import { Injectable } from '@nestjs/common'
import { DataSource } from 'typeorm'

@Injectable()
export class CommentsSqlRepository {
  constructor(private dataSource: DataSource) {}

  async createCommentsTable() {
    await this.dataSource.query(`
      CREATE TABLE IF NOT EXISTS public.comments
        (
            parent_id uuid NOT NULL,
            content character varying(300) NOT NULL,
            created_at timestamp without time zone NOT NULL,
            user_id uuid NOT NULL,
            user_login character varying(10) NOT NULL,
            likes_count integer,
            dislikes_count integer,
            PRIMARY KEY ("parentId"),
            CONSTRAINT parent_id UNIQUE (parent_id)
        );

      ALTER TABLE IF EXISTS public.comments
          OWNER to sa_sql_user;
    `)
  }
}

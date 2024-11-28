import { Injectable } from '@nestjs/common'
import { DataSource } from 'typeorm'

@Injectable()
export class LikesSqlRepository {
  constructor(private dataSource: DataSource) {}

  async createLikesTable() {
    await this.dataSource.query(`
      CREATE TABLE public.likes
        (
            parent_id uuid NOT NULL,
            status character varying(30) NOT NULL,
            created_at timestamp without time zone NOT NULL,
            user_id uuid NOT NULL,
            user_login character varying(10) NOT NULL,
            PRIMARY KEY (parent_id)
        );

      ALTER TABLE IF EXISTS public.likes
          OWNER to sa_sql_user;
    `)
  }
}

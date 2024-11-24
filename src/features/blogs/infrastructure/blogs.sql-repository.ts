import { Injectable } from '@nestjs/common'
import { DataSource } from 'typeorm'
import { Blog } from '../domain/mongoose/blogs.entity'

@Injectable()
export class BlogsSqlRepository {
  constructor(private dataSource: DataSource) {}
  async createBlogsTable() {
    await this.dataSource.query(`
      CREATE TABLE IF NOT EXISTS public.blogs
        (
            id uuid NOT NULL DEFAULT gen_random_uuid(),
            name character varying(15) NOT NULL,
            description character varying(500) NOT NULL,
            website_url character varying(100) NOT NULL,
            created_at timestamp without time zone,
            is_membership boolean DEFAULT false,
            PRIMARY KEY (id)
        );

      ALTER TABLE IF EXISTS public.blogs
          OWNER to sa_sql_user;
    `)

    await this.createPostsTable()
  }
  async createPostsTable() {
    await this.dataSource.query(`
      CREATE TABLE IF NOT EXISTS public.posts
        (
            id uuid NOT NULL DEFAULT gen_random_uuid(),
            title character varying(30) NOT NULL,
            short_description character varying(100) NOT NULL,
            content character varying(1000) NOT NULL,
            blog_id uuid NOT NULL,
            blog_name character varying(15) NOT NULL,
            created_at timestamp without time zone,
            likes_count integer,
            dislikes_count integer,
            PRIMARY KEY (id),
            CONSTRAINT link_with_blogs FOREIGN KEY (blog_id)
                REFERENCES public.blogs (id) MATCH SIMPLE
                ON UPDATE NO ACTION
                ON DELETE NO ACTION
                NOT VALID
        );

      ALTER TABLE IF EXISTS public.posts
        OWNER to sa_sql_user;
    `)
  }

  async createBlog(newBlog: Blog) {
    const { name, description, websiteUrl, createdAt, isMembership } = newBlog
    const createBlogResult = await this.dataSource.query(
      `
      INSERT INTO public.blogs(
        name, description, website_url, created_at, is_membership)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id;
    `,
      [name, description, websiteUrl, createdAt, isMembership],
    )

    return createBlogResult?.[0]?.id ?? null
  }
}

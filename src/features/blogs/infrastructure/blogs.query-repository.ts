import { Injectable } from '@nestjs/common'
import { Blog } from '../domain/mongoose/blogs.entity'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { BlogsMappers } from './blogs.mappers'
import { DataSource } from 'typeorm'
import { BlogSql } from '../domain/postgres/blog.sql'
import { SortDirection } from '../../../common/models/enums/sort-direction'
import { camelToSnakeUtil } from '../../../common/utils'
import { FilterBlogDto } from '../api/models/input/filter.blog.dto'

@Injectable()
export class BlogsQueryRepository {
  constructor(
    @InjectModel(Blog.name) private blogsModel: Model<Blog>,
    private dataSource: DataSource,
    private blogsMappers: BlogsMappers,
  ) {}

  async getAllBlogs(query: FilterBlogDto) {
    const { pageNumber, pageSize, sortBy, sortDirection, searchNameTerm } = query
    const offset = (pageNumber - 1) * pageSize
    const direction = sortDirection === SortDirection.DESC ? 'DESC' : 'ASC'
    const sortBySnakeCase = camelToSnakeUtil(sortBy)

    const blogs = await this.dataSource.query(
      `
      SELECT id, name, description, website_url, created_at, is_membership
        FROM public.blogs
        WHERE name ILIKE '%' || $3 || '%'
        ORDER BY "${sortBySnakeCase}" ${direction}
        LIMIT $1 OFFSET $2;
    `,
      [pageSize, offset, searchNameTerm || ''],
    )
    const totalCountResult = await this.dataSource.query(
      `SELECT COUNT(*) AS "totalCount"
         FROM public.blogs
         WHERE name ILIKE '%' || $1 || '%';`,
      [searchNameTerm],
    )

    const totalCount = parseInt(totalCountResult?.[0]?.totalCount, 10)
    const mappedBlogs = blogs.map(this.blogsMappers.mapBlogToOutput)
    const pagesCount = Math.ceil(totalCount / pageSize)

    return {
      pagesCount,
      totalCount,
      pageSize,
      page: pageNumber,
      items: mappedBlogs,
    }
  }

  async getBlogById(blogId: string) {
    const blogResult = await this.dataSource.query<BlogSql[]>(
      `
      SELECT id, name, description, website_url, created_at, is_membership
      FROM public.blogs
      WHERE id=$1;
    `,
      [blogId],
    )

    return this.blogsMappers.mapBlogToOutput(blogResult?.[0])
  }
}

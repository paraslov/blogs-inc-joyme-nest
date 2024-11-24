import { Injectable } from '@nestjs/common'
import { Blog } from '../domain/mongoose/blogs.entity'
import { StandardInputFiltersWithSearchTerm } from '../../../common/models/input/QueryInputParams'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { BlogsMappers } from './blogs.mappers'
import { DataSource } from 'typeorm'
import { BlogSql } from '../domain/postgres/blog.sql'

@Injectable()
export class BlogsQueryRepository {
  constructor(
    @InjectModel(Blog.name) private blogsModel: Model<Blog>,
    private dataSource: DataSource,
    private blogsMappers: BlogsMappers,
  ) {}

  async getAllBlogs(query: StandardInputFiltersWithSearchTerm) {
    const { pageNumber, pageSize, sortBy, sortDirection, searchNameTerm } = query

    const filter = {
      name: { $regex: new RegExp(searchNameTerm, 'i') },
    }

    const blogs = await this.blogsModel
      .find(filter)
      .sort({ [sortBy]: sortDirection === 'asc' ? 1 : -1 })
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .exec()
    // const mappedBlogs = blogs.map(this.blogsMappers.mapBlogToOutput)

    const totalCount = await this.blogsModel.countDocuments(filter)
    const pagesCount = Math.ceil(totalCount / pageSize)

    return {
      pagesCount,
      totalCount,
      pageSize,
      page: pageNumber,
      items: [],
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

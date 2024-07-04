import { Injectable } from '@nestjs/common'
import { Blog } from '../domain/mongoose/blogs.entity'
import { StandardInputFilters } from '../../../common/models/input/QueryInputParams'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { BlogsMappers } from './blogs.mappers'

@Injectable()
export class BlogsQueryRepository {
  constructor(
    @InjectModel(Blog.name) private blogsModel: Model<Blog>,
    private blogsMappers: BlogsMappers,
  ) {}

  async getAllBlogs(query: StandardInputFilters) {
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
    const mappedBlogs = blogs.map(this.blogsMappers.mapBlogToOutput)

    const totalCount = await this.blogsModel.countDocuments(filter)
    const pagesCount = Math.ceil(totalCount / pageSize)

    return {
      pagesCount,
      totalCount,
      pageSize,
      page: pageNumber,
      items: mappedBlogs,
    }
  }

  async getBlogById(id: string) {
    const blog = await this.blogsModel.findById(id).exec()

    return this.blogsMappers.mapBlogToOutput(blog)
  }
}

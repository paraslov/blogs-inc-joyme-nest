import { Injectable } from '@nestjs/common'
import { Blog } from '../domain/mongoose/blogs.entity'
import { StandardInputFilters } from '../../../common/models/input/QueryInputParams'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'

@Injectable()
export class BlogsQueryRepository {
  constructor(@InjectModel(Blog.name) private blogsModel: Model<Blog>) {}

  async getAllBlogs(query: StandardInputFilters) {
    const { pageNumber, pageSize, sortBy, sortDirection, searchNameTerm } =
      query

    const filter = {
      name: { $regex: new RegExp(searchNameTerm, 'i') },
    }

    const blogs = await this.blogsModel
      .find(filter)
      .sort({ [sortBy]: sortDirection === 'asc' ? 1 : -1 })
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .exec()

    const totalCount = await this.blogsModel.countDocuments(filter)
    const pagesCount = Math.ceil(totalCount / pageSize)

    return {
      pagesCount,
      totalCount,
      pageSize,
      page: pageNumber,
      items: blogs,
    }
  }

  async getBlogById(id: string) {
    return this.blogsModel.findById(id).exec()
  }
}

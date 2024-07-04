import { Injectable } from '@nestjs/common'
import { Blog } from '../domain/mongoose/blogs.entity'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { UpdateBlogDto } from '../api/models/input/update-blog.dto'

@Injectable()
export class BlogsRepository {
  constructor(@InjectModel(Blog.name) private blogsModel: Model<Blog>) {}

  async saveBlog(blog: Blog) {
    return new this.blogsModel(blog).save()
  }
  async updateBlog(id: string, updateBlog: UpdateBlogDto) {
    const updateResult = await this.blogsModel.updateOne({ _id: id }, updateBlog)

    return Boolean(updateResult.matchedCount)
  }
}

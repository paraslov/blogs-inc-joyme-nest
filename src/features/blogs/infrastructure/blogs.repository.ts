import { Injectable } from '@nestjs/common'
import { Blog } from '../domain/mongoose/blogs.entity'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'

@Injectable()
export class BlogsRepository {
  constructor(@InjectModel(Blog.name) private blogsModel: Model<Blog>) {}

  async saveBlog(blog: Blog) {
    return new this.blogsModel(blog).save()
  }
}

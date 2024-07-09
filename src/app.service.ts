import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Blog } from './features/blogs'
import { Model } from 'mongoose'
import { Post } from './features/posts'

@Injectable()
export class AppService {
  constructor(
    @InjectModel(Blog.name) private blogModel: Model<Blog>,
    @InjectModel(Post.name) private postModel: Model<Post>,
  ) {}

  getHello(): string {
    return 'Welcome to JoymeStudios Blogs App!'
  }
  getVersion(): string {
    return 'blogs-inc-joyme: v4.1.0'
  }
  async deleteAllData() {
    try {
      await this.blogModel.deleteMany({})
      await this.postModel.deleteMany({})
    } catch (err) {
      throw new NotFoundException(`Failed to clear data: ${err.message}`)
    }
  }
}

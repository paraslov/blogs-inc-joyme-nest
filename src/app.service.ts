import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Blog } from './features/blogs'
import { Model } from 'mongoose'
import { Post } from './features/posts'
import { User } from './features/users'
import { Comment } from './features/comments'

@Injectable()
export class AppService {
  constructor(
    @InjectModel(Blog.name) private blogModel: Model<Blog>,
    @InjectModel(Post.name) private postModel: Model<Post>,
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Comment.name) private commentModel: Model<Comment>,
  ) {}

  getHello(): string {
    return 'Welcome to JoymeStudios Blogs App!'
  }
  getVersion(): string {
    return 'blogs-inc-joyme: v4.1.3'
  }
  async deleteAllData() {
    try {
      await this.blogModel.deleteMany({})
      await this.postModel.deleteMany({})
      await this.userModel.deleteMany({})
      await this.commentModel.deleteMany({})
    } catch (err) {
      throw new NotFoundException(`Failed to clear data: ${err.message}`)
    }
  }
}

import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Blog } from './features/blogs'
import { Model } from 'mongoose'
import { Post } from './features/posts'
import { User } from './features/users'
import { Comment } from './features/comments'
import { Like } from './features/likes'

@Injectable()
export class AppService {
  constructor(
    @InjectModel(Blog.name) private blogModel: Model<Blog>,
    @InjectModel(Post.name) private postModel: Model<Post>,
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Comment.name) private commentModel: Model<Comment>,
    @InjectModel(Like.name) private likeModel: Model<Like>,
  ) {}

  getHello(): string {
    return 'Welcome to JoymeStudios Blogs App!'
  }
  getVersion(): string {
    return 'blogs-inc-joyme: v4.2.7'
  }
  async deleteAllData() {
    try {
      await this.blogModel.deleteMany({})
      await this.postModel.deleteMany({})
      await this.userModel.deleteMany({})
      await this.commentModel.deleteMany({})
      await this.likeModel.deleteMany({})
    } catch (err) {
      throw new NotFoundException(`Failed to clear data: ${err.message}`)
    }
  }
}

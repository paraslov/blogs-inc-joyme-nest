import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Blog } from './features/blogs'
import { Model } from 'mongoose'
import { PostEntity } from './features/posts'
import { User } from './features/users'
import { CommentDto } from './features/comments'
import { Like } from './features/likes'
import { Device } from './features/devices'

@Injectable()
export class AppService {
  constructor(
    @InjectModel(Blog.name) private blogModel: Model<Blog>,
    @InjectModel(PostEntity.name) private postModel: Model<PostEntity>,
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(CommentDto.name) private commentModel: Model<CommentDto>,
    @InjectModel(Like.name) private likeModel: Model<Like>,
    @InjectModel(Like.name) private devicesModel: Model<Device>,
  ) {}

  getHello(): string {
    return 'Welcome to JoymeStudios Blogs App!'
  }
  getVersion(): string {
    return 'blogs-inc-joyme: v4.4.0'
  }
  async deleteAllData() {
    try {
      await this.blogModel.deleteMany({})
      await this.postModel.deleteMany({})
      await this.userModel.deleteMany({})
      await this.commentModel.deleteMany({})
      await this.likeModel.deleteMany({})
      await this.devicesModel.deleteMany({})
    } catch (err) {
      throw new NotFoundException(`Failed to clear data: ${err.message}`)
    }
  }
}

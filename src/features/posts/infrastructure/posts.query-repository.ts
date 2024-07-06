import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Post } from '../domain/mongoose/posts.entity'
import { Model } from 'mongoose'
import { PostsMappers } from './posts.mappers'

@Injectable()
export class PostsQueryRepository {
  constructor(
    @InjectModel(Post.name) private postsModel: Model<Post>,
    private postsMappers: PostsMappers
  ) {}

  async getPostById(id: string) {
    const post = await this.postsModel.findById(id)

    return this.postsMappers.mapPostToOutputDto(post)
  }
}

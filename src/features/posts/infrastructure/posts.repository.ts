import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Post } from '../domain/mongoose/posts.entity'
import { Model } from 'mongoose'
import { PostsMappers } from './posts.mappers'

@Injectable()
export class PostsRepository {
  constructor(
    @InjectModel(Post.name) private postsModel: Model<Post>,
    private postsMappers: PostsMappers,
  ) {}

  async savePost(post: Post) {
    const savedPost = await new this.postsModel(post).save()

    return this.postsMappers.mapPostToOutputDto(savedPost)
  }
}

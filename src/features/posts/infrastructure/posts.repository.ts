import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { PostEntity } from '../domain/mongoose/posts.entity'
import { Model } from 'mongoose'
import { PostsMappers } from './posts.mappers'
import { CreatePostDto } from '../api/models/input/create-post.dto'

@Injectable()
export class PostsRepository {
  constructor(
    @InjectModel(PostEntity.name) private postsModel: Model<PostEntity>,
    private postsMappers: PostsMappers,
  ) {}

  async savePost(post: PostEntity) {
    const savedPost = await new this.postsModel(post).save()

    return this.postsMappers.mapPostToOutputDto(savedPost)
  }
  async updatePost(id: string, updatePostDto: CreatePostDto) {
    const updateResult = await this.postsModel.updateOne({ _id: id }, updatePostDto)

    return Boolean(updateResult.matchedCount)
  }
  async deletePost(id: string) {
    const deleteResult = await this.postsModel.deleteOne({ _id: id })

    return Boolean(deleteResult.deletedCount)
  }
}

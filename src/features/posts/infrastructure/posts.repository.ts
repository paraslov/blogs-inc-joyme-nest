import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Post } from '../domain/mongoose/posts.entity'
import { Model } from 'mongoose'
import { PostsMappers } from './posts.mappers'
import { UpdatePostDto } from '../api/models/input/update-post.dto'

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
  async updatePost(id: string, updatePostDto: UpdatePostDto) {
    const updateResult = await this.postsModel.updateOne({ _id: id }, updatePostDto)

    return Boolean(updateResult.matchedCount)
  }
  async deletePost(id: string) {
    const deleteResult = await this.postsModel.deleteOne({ _id: id })

    return Boolean(deleteResult.deletedCount)
  }
}

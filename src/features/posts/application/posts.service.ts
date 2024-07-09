import { Injectable } from '@nestjs/common'
import { CreatePostDto } from '../api/models/input/create-post.dto'
import { Post } from '../domain/mongoose/posts.entity'
import { PostsRepository } from '../infrastructure/posts.repository'
import { UpdatePostDto } from '../api/models/input/update-post.dto'

@Injectable()
export class PostsService {
  constructor(private postsRepository: PostsRepository) {}

  async createPost(createPostDto: CreatePostDto, blogName: string) {
    const newPost: Post = {
      ...createPostDto,
      blogName,
      createdAt: new Date().toISOString(),
      extendedLikeInfo: null,
    }

    return this.postsRepository.savePost(newPost)
  }
  async updatePost(id: string, updatePostDto: UpdatePostDto) {
    return this.postsRepository.updatePost(id, updatePostDto)
  }
  async deleteOne(id: string) {
    return this.postsRepository.deletePost(id)
  }
}

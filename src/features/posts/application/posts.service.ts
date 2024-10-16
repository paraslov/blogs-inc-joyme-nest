import { Injectable } from '@nestjs/common'
import { CreatePostDto } from '../api/models/input/create-post.dto'
import { PostEntity } from '../domain/mongoose/posts.entity'
import { PostsRepository } from '../infrastructure/posts.repository'
import { UpdatePostDto } from '../api/models/input/update-post.dto'

@Injectable()
export class PostsService {
  constructor(private postsRepository: PostsRepository) {}

  async createPost(createPostDto: CreatePostDto, blogName: string) {
    const newPost: PostEntity = {
      ...createPostDto,
      blogName,
      createdAt: new Date().toISOString(),
      likesCount: 0,
      dislikesCount: 0,
    }

    return this.postsRepository.savePost(newPost)
  }
  async updatePost(id: string, updatePostDto: UpdatePostDto) {
    return this.postsRepository.updatePost(id, updatePostDto)
  }
  async deletePost(id: string) {
    return this.postsRepository.deletePost(id)
  }
}

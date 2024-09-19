import { Injectable } from '@nestjs/common'
import { CreateBlogDto } from '../api/models/input/create-blog.dto'
import { UpdateBlogDto } from '../api/models/input/update-blog.dto'
import { BlogsRepository } from '../infrastructure/blogs.repository'
import { CreateBlogPostDto } from '../api/models/input/create-blog-post.dto'
import { CommandBus } from '@nestjs/cqrs'
import { CreateBlogCommand } from './commands/create-blog.command'
import { CreatePostForBlogCommand } from './commands/create-post-for-blog.command'

@Injectable()
export class BlogsService {
  constructor(
    private blogsRepository: BlogsRepository,
    private commandBus: CommandBus,
  ) {}

  createBlog(createBlogDto: CreateBlogDto) {
    const command = new CreateBlogCommand(createBlogDto)

    return this.commandBus.execute(command)
  }

  async createPost(createBlogPostDto: CreateBlogPostDto, blogId: string, blogName: string) {
    const command = new CreatePostForBlogCommand(createBlogPostDto, blogId, blogName)

    return this.commandBus.execute(command)
  }

  async updateBlog(id: string, updateBlog: UpdateBlogDto) {
    return this.blogsRepository.updateBlog(id, updateBlog)
  }

  async deleteBlog(id: string) {
    return this.blogsRepository.deleteBlog(id)
  }
}

import { Injectable } from '@nestjs/common'
import { CreateBlogDto } from '../api/models/input/create-blog.dto'
import { CreateBlogPostDto } from '../api/models/input/create-blog-post.dto'
import { CommandBus } from '@nestjs/cqrs'
import { CreateBlogCommand } from './commands/create-blog.command'
import { CreatePostForBlogCommand } from './commands/create-post-for-blog.command'
import { UpdateBlogCommand } from './commands/update-blog.command'
import { DeleteBlogCommand } from './commands/delete-blog.command'

@Injectable()
export class BlogsCommandService {
  constructor(private commandBus: CommandBus) {}

  createBlog(createBlogDto: CreateBlogDto) {
    const command = new CreateBlogCommand(createBlogDto)

    return this.commandBus.execute(command)
  }

  async createPost(createBlogPostDto: CreateBlogPostDto, blogId: string, blogName: string) {
    const command = new CreatePostForBlogCommand(createBlogPostDto, blogId, blogName)

    return this.commandBus.execute(command)
  }

  async updateBlog(blogId: string, updateBlogDto: CreateBlogDto) {
    const command = new UpdateBlogCommand(blogId, updateBlogDto)

    return this.commandBus.execute(command)
  }

  async deleteBlog(blogId: string) {
    const command = new DeleteBlogCommand(blogId)

    return this.commandBus.execute(command)
  }
}

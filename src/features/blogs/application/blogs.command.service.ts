import { Injectable } from '@nestjs/common'
import { CreateBlogDto } from '../api/models/input/create-blog.dto'
import { CreateBlogPostDto } from '../api/models/input/create-blog-post.dto'
import { CommandBus } from '@nestjs/cqrs'
import { CreateBlogCommand } from './commands/create-blog.command'
import { CreatePostForBlogCommand } from './commands/create-post-for-blog.command'
import { UpdateBlogCommand } from './commands/update-blog.command'
import { DeleteBlogCommand } from './commands/delete-blog.command'
import { UpdatePostDto } from '../api/models/input/update-post.dto'
import { UpdatePostCommand } from './commands/update-post.command'

@Injectable()
export class BlogsCommandService {
  constructor(private commandBus: CommandBus) {}

  createBlog(createBlogDto: CreateBlogDto) {
    const command = new CreateBlogCommand(createBlogDto)

    return this.commandBus.execute(command)
  }

  createPost(createBlogPostDto: CreateBlogPostDto, blogId: string, blogName: string) {
    const command = new CreatePostForBlogCommand(createBlogPostDto, blogId, blogName)

    return this.commandBus.execute<CreatePostForBlogCommand, string | null>(command)
  }

  updateBlog(blogId: string, updateBlogDto: CreateBlogDto) {
    const command = new UpdateBlogCommand(blogId, updateBlogDto)

    return this.commandBus.execute(command)
  }

  deleteBlog(blogId: string) {
    const command = new DeleteBlogCommand(blogId)

    return this.commandBus.execute(command)
  }

  updatePost(postId: string, updatePostDto: UpdatePostDto) {
    const command = new UpdatePostCommand(postId, updatePostDto)

    return this.commandBus.execute<UpdatePostCommand, boolean>(command)
  }
}

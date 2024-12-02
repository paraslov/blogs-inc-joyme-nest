import { Blog } from '../../domain/mongoose/blogs.entity'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { CreateBlogDto } from '../../api/models/input/create-blog.dto'
import { BlogsRepository } from '../../infrastructure/blogs.repository.service'

export class CreateBlogCommand {
  constructor(public readonly createBlogDto: CreateBlogDto) {}
}

@CommandHandler(CreateBlogCommand)
export class CreateBlogHandler implements ICommandHandler<CreateBlogCommand> {
  constructor(private readonly blogsRepository: BlogsRepository) {}

  async execute(command: CreateBlogCommand) {
    const { createBlogDto } = command

    const createdBlog: Blog = {
      ...createBlogDto,
      createdAt: new Date().toISOString(),
      isMembership: false,
    }

    return this.blogsRepository.createBlog(createdBlog)
  }
}

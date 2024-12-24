import { Blog } from '../../domain/business_entities/blogs.entity'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { CreateBlogDto } from '../../api/models/input/create-blog.dto'
import { BlogsRepository } from '../../infrastructure/blogs.repository'

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

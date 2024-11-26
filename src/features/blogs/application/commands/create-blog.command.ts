import { Blog } from '../../domain/mongoose/blogs.entity'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { CreateBlogDto } from '../../api/models/input/create-blog.dto'
import { BlogsSqlRepository } from '../../infrastructure/blogs.sql-repository'

export class CreateBlogCommand {
  constructor(public readonly createBlogDto: CreateBlogDto) {}
}

@CommandHandler(CreateBlogCommand)
export class CreateBlogHandler implements ICommandHandler<CreateBlogCommand> {
  constructor(private readonly blogsRepository: BlogsSqlRepository) {}

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

import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { CreateBlogDto } from '../../api/models/input/create-blog.dto'
import { BlogsSqlRepository } from '../../infrastructure/blogs.sql-repository'

export class UpdateBlogCommand {
  constructor(
    public readonly blogId: string,
    public readonly updateBlogDto: CreateBlogDto,
  ) {}
}

@CommandHandler(UpdateBlogCommand)
export class UpdateBlogHandler implements ICommandHandler<UpdateBlogCommand> {
  constructor(private readonly blogsRepository: BlogsSqlRepository) {}

  execute(command: UpdateBlogCommand) {
    const { blogId, updateBlogDto } = command

    return this.blogsRepository.updateBlog(blogId, updateBlogDto)
  }
}

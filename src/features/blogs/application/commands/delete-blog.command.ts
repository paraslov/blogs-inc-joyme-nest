import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { BlogsSqlRepository } from '../../infrastructure/blogs.sql-repository'

export class DeleteBlogCommand {
  constructor(public readonly blogId: string) {}
}

@CommandHandler(DeleteBlogCommand)
export class DeleteBlogHandler implements ICommandHandler<DeleteBlogCommand> {
  constructor(private readonly blogsRepository: BlogsSqlRepository) {}

  execute(command: DeleteBlogCommand) {
    const { blogId } = command

    return this.blogsRepository.deleteBlog(blogId)
  }
}

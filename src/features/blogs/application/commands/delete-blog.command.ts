import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { BlogsRepository } from '../../infrastructure/blogs.repository'

export class DeleteBlogCommand {
  constructor(public readonly blogId: string) {}
}

@CommandHandler(DeleteBlogCommand)
export class DeleteBlogHandler implements ICommandHandler<DeleteBlogCommand> {
  constructor(private readonly blogsRepository: BlogsRepository) {}

  execute(command: DeleteBlogCommand) {
    const { blogId } = command

    return this.blogsRepository.deleteBlog(blogId)
  }
}

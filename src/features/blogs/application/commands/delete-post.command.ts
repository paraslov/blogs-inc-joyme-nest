import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { BlogsSqlRepository } from '../../infrastructure/blogs.sql-repository'

export class DeletePostCommand {
  constructor(public readonly postId: string) {}
}

@CommandHandler(DeletePostCommand)
export class DeletePostCommandHandler implements ICommandHandler<DeletePostCommand> {
  constructor(private readonly blogsRepository: BlogsSqlRepository) {}

  async execute(command: DeletePostCommand) {
    const { postId } = command

    return this.blogsRepository.deletePostForBlog(postId)
  }
}

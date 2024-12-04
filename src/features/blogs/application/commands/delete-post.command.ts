import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { BlogsRepository } from '../../infrastructure/blogs.repository.service'

export class DeletePostCommand {
  constructor(public readonly postId: string) {}
}

@CommandHandler(DeletePostCommand)
export class DeletePostCommandHandler implements ICommandHandler<DeletePostCommand> {
  constructor(private readonly blogsRepository: BlogsRepository) {}

  async execute(command: DeletePostCommand) {
    const { postId } = command

    return this.blogsRepository.deletePostForBlog(postId)
  }
}

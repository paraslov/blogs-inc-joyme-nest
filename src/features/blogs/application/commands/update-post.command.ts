import { UpdatePostDto } from '../../api/models/input/update-post.dto'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { BlogsRepository } from '../../infrastructure/blogs.repository'

export class UpdatePostCommand {
  constructor(
    public postId: string,
    public updatePostDto: UpdatePostDto,
  ) {}
}

@CommandHandler(UpdatePostCommand)
export class UpdatePostCommandHandler implements ICommandHandler<UpdatePostCommand> {
  constructor(private readonly blogsRepository: BlogsRepository) {}

  async execute(command: UpdatePostCommand) {
    const { postId, updatePostDto } = command

    return this.blogsRepository.updatePostForBlog(postId, updatePostDto)
  }
}

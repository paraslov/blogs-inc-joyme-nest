import { UpdateBlogDto } from '../../api/models/input/update-blog.dto'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { BlogsRepository } from '../../infrastructure/blogs.repository'

export class UpdateBlogCommand {
  constructor(
    public readonly blogId: string,
    public readonly updateBlogDto: UpdateBlogDto,
  ) {}
}

@CommandHandler(UpdateBlogCommand)
export class UpdateBlogHandler implements ICommandHandler<UpdateBlogCommand> {
  constructor(private readonly blogsRepository: BlogsRepository) {}

  execute(command: UpdateBlogCommand) {
    const { blogId, updateBlogDto } = command

    return this.blogsRepository.updateBlog(blogId, updateBlogDto)
  }
}

import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { CreateBlogDto } from '../../api/models/input/create-blog.dto'
import { BlogsRepository } from '../../infrastructure/blogs.repository.service'

export class UpdateBlogCommand {
  constructor(
    public readonly blogId: string,
    public readonly updateBlogDto: CreateBlogDto,
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

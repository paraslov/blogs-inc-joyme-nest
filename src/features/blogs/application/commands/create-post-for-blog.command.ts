import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { CreateBlogPostDto } from '../../api/models/input/create-blog-post.dto'
import { Post } from '../../../posts'
import { BlogsRepository } from '../../infrastructure/blogs.repository'

export class CreatePostForBlogCommand {
  constructor(
    public readonly createBlogPostDto: CreateBlogPostDto,
    public readonly blogId: string,
    public readonly blogName: string,
  ) {}
}

@CommandHandler(CreatePostForBlogCommand)
export class CreatePostForBlogHandler implements ICommandHandler<CreatePostForBlogCommand> {
  constructor(private readonly blogsRepository: BlogsRepository) {}

  async execute(command: CreatePostForBlogCommand) {
    const { createBlogPostDto, blogId, blogName } = command

    const newPost: Post = {
      ...createBlogPostDto,
      blogId,
      blogName,
      createdAt: new Date().toISOString(),
      extendedLikeInfo: null,
    }

    return this.blogsRepository.savePost(newPost)
  }
}

import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { CreateBlogPostDto } from '../../api/models/input/create-blog-post.dto'
import { BlogsSqlRepository } from '../../infrastructure/blogs.sql-repository'
import { PostEntity } from '../../domain/mongoose/posts.entity'

export class CreatePostForBlogCommand {
  constructor(
    public readonly createBlogPostDto: CreateBlogPostDto,
    public readonly blogId: string,
    public readonly blogName: string,
  ) {}
}

@CommandHandler(CreatePostForBlogCommand)
export class CreatePostForBlogHandler implements ICommandHandler<CreatePostForBlogCommand> {
  constructor(private readonly blogsRepository: BlogsSqlRepository) {}

  async execute(command: CreatePostForBlogCommand) {
    const { createBlogPostDto, blogId, blogName } = command

    const newPost: PostEntity = {
      ...createBlogPostDto,
      blogId,
      blogName,
      createdAt: new Date().toISOString(),
      likesCount: 0,
      dislikesCount: 0,
    }

    return this.blogsRepository.createPostForBlog(newPost)
  }
}

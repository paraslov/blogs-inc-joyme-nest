import { CreateBlogHandler } from './create-blog.command'
import { CreatePostForBlogHandler } from './create-post-for-blog.command'
import { UpdateBlogHandler } from './update-blog.command'
import { DeleteBlogHandler } from './delete-blog.command'
import { UpdatePostCommandHandler } from './update-post.command'

export const blogsCommandHandlers = [
  CreateBlogHandler,
  CreatePostForBlogHandler,
  UpdateBlogHandler,
  DeleteBlogHandler,
  UpdatePostCommandHandler,
]

import { CreateBlogHandler } from './create-blog.command'
import { CreatePostForBlogHandler } from './create-post-for-blog.command'
import { UpdateBlogHandler } from './update-blog.command'
import { DeleteBlogHandler } from './delete-blog.command'
import { UpdatePostCommandHandler } from './update-post.command'
import { DeletePostCommandHandler } from './delete-post.command'
import { UpdatePostLikeStatusHandler } from './update-post-like-status.command'

export const blogsCommandHandlers = [
  CreateBlogHandler,
  UpdateBlogHandler,
  DeleteBlogHandler,
  CreatePostForBlogHandler,
  UpdatePostCommandHandler,
  UpdatePostLikeStatusHandler,
  DeletePostCommandHandler,
]

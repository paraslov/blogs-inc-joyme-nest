import { CreateBlogHandler } from './create-blog.command'
import { CreatePostForBlogHandler } from './create-post-for-blog.command'
import { UpdateBlogHandler } from './update-blog.command'

export const blogsCommandHandlers = [CreateBlogHandler, CreatePostForBlogHandler, UpdateBlogHandler]

import { CreateBlogHandler } from './create-blog.command'
import { CreatePostForBlogHandler } from './create-post-for-blog.command'

export const blogsCommandHandlers = [CreateBlogHandler, CreatePostForBlogHandler]

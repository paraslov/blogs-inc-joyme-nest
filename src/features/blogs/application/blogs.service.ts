import { Injectable } from '@nestjs/common'
import { CreateBlogDto } from '../api/models/input/create-blog.dto'
import { UpdateBlogDto } from '../api/models/input/update-blog.dto'
import { Blog } from '../domain/mongoose/blogs.entity'
import { BlogsRepository } from '../infrastructure/blogs.repository'
import { BlogsMappers } from '../infrastructure/blogs.mappers'
import { CreateBlogPostDto } from '../api/models/input/create-blog-post.dto'
import { Post } from '../../posts'

@Injectable()
export class BlogsService {
  constructor(
    private blogsRepository: BlogsRepository,
    private blogsMappers: BlogsMappers,
  ) {}

  async createBlog(createBlogDto: CreateBlogDto) {
    const createdBlog: Blog = {
      ...createBlogDto,
      createdAt: new Date().toISOString(),
      isMembership: false,
    }
    const saveBlogResult = await this.blogsRepository.saveBlog(createdBlog)

    return this.blogsMappers.mapBlogToOutput(saveBlogResult)
  }

  async createPost(createBlogPostDto: CreateBlogPostDto, blogId: string, blogName: string) {
    const newPost: Post = {
      ...createBlogPostDto,
      blogId,
      blogName,
      createdAt: new Date().toISOString(),
      extendedLikeInfo: null,
    }

    return this.blogsRepository.savePost(newPost)
  }

  async updateBlog(id: string, updateBlog: UpdateBlogDto) {
    return this.blogsRepository.updateBlog(id, updateBlog)
  }

  async deleteBlog(id: string) {
    return this.blogsRepository.deleteBlog(id)
  }
}

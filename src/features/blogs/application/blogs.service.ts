import { Injectable } from '@nestjs/common'
import { CreateBlogDto } from '../api/models/input/create-blog.dto'
import { UpdateBlogDto } from '../api/models/input/update-blog.dto'
import { InjectModel } from '@nestjs/mongoose'
import { Blog } from '../domain/mongoose/blogs.entity'
import { Model } from 'mongoose'
import { BlogsRepository } from '../infrastructure/blogs.repository'
import { StandardInputFilters } from '../../../common/models/input/QueryInputParams'
import { BlogsQueryRepository } from '../infrastructure/blogs.query-repository'
import { BlogsMappers } from '../infrastructure/blogs.mappers'

@Injectable()
export class BlogsService {
  constructor(
    @InjectModel(Blog.name) private blogsModel: Model<Blog>,
    private blogsRepository: BlogsRepository,
    private blogsQueryRepository: BlogsQueryRepository,
    private blogsMappers: BlogsMappers,
  ) {}

  async create(createBlogDto: CreateBlogDto) {
    const createdBlog: Blog = {
      ...createBlogDto,
      createdAt: new Date().toISOString(),
      isMembership: true,
    }
    const saveBlogResult = await this.blogsRepository.saveBlog(createdBlog)

    return this.blogsMappers.mapBlogToOutput(saveBlogResult)
  }

  async findAll(query: StandardInputFilters) {
    return await this.blogsQueryRepository.getAllBlogs(query)
  }

  async findOne(id: string) {
    return await this.blogsQueryRepository.getBlogById(id)
  }

  async update(id: string, updateBlog: UpdateBlogDto) {
    return this.blogsRepository.updateBlog(id, updateBlog)
  }

  async remove(id: string) {
    return this.blogsRepository.deleteBlog(id)
  }
}

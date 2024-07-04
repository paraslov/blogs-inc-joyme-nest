import { Injectable } from '@nestjs/common'
import { CreateBlogDto } from '../api/models/input/create-blog.dto'
import { UpdateBlogDto } from '../api/models/input/update-blog.dto'
import { InjectModel } from '@nestjs/mongoose'
import { Blog } from '../domain/mongoose/blogs.entity'
import { Model } from 'mongoose'
import { BlogsRepository } from '../infrastructure/blogs.repository'
import { StandardInputFilters } from '../../../common/models/input/QueryInputParams'
import { BlogsQueryRepository } from '../infrastructure/blogs.query-repository'

@Injectable()
export class BlogsService {
  constructor(
    @InjectModel(Blog.name) private blogsModel: Model<Blog>,
    private blogsRepository: BlogsRepository,
    private blogsQueryRepository: BlogsQueryRepository,
  ) {}

  async create(createBlogDto: CreateBlogDto) {
    const createdBlog: Blog = {
      ...createBlogDto,
      createdAt: new Date().toISOString(),
      isMembership: true,
    }

    return await this.blogsRepository.saveBlog(createdBlog)
  }

  async findAll(query: StandardInputFilters) {
    return await this.blogsQueryRepository.getAllBlogs(query)
  }

  async findOne(id: string) {
    return await this.blogsQueryRepository.getBlogById(id)
  }

  async update(id: string, updateBlogDto: UpdateBlogDto) {
    return this.blogsModel.updateOne({ _id: id }, updateBlogDto)
  }

  async remove(id: string) {
    await this.blogsModel.deleteOne({ _id: id })

    return
  }
}

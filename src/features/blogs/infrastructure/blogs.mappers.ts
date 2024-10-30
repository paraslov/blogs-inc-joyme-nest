import { BlogDocument } from '../domain/mongoose/blogs.entity'
import { BlogViewDto } from '../api/models/output/blog-view.dto'
import { Injectable } from '@nestjs/common'

@Injectable()
export class BlogsMappers {
  mapBlogToOutput(blog: BlogDocument): BlogViewDto {
    if (!blog) {
      return null
    }

    const blogModel = new BlogViewDto()

    blogModel.id = blog._id.toString()
    blogModel.name = blog.name
    blogModel.description = blog.description
    blogModel.websiteUrl = blog.websiteUrl
    blogModel.createdAt = blog.createdAt
    blogModel.isMembership = blog.isMembership

    return blogModel
  }
}

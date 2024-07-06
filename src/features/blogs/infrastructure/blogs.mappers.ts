import { BlogDocument } from '../domain/mongoose/blogs.entity'
import { BlogOutputModel } from '../api/models/output/blog.dto'
import { Injectable } from '@nestjs/common'

@Injectable()
export class BlogsMappers {
  mapBlogToOutput(blog: BlogDocument): BlogOutputModel {
    if (!blog) {
      return null
    }

    const blogModel = new BlogOutputModel()

    blogModel.id = blog._id.toString()
    blogModel.name = blog.name
    blogModel.description = blog.description
    blogModel.websiteUrl = blog.websiteUrl
    blogModel.createdAt = blog.createdAt
    blogModel.isMembership = blog.isMembership

    return blogModel
  }
}

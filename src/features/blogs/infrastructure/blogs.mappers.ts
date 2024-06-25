import { BlogDocument } from '../domain/mongoose/blogs.entity'
import { BlogOutputModel } from '../api/models/output/blog.entity'

export class BlogsMappers {
  outputModel(blog: BlogDocument) {
    const blogModel = new BlogOutputModel()

    blogModel.id = blog.id
    blogModel.name = blog.name
    blogModel.description = blog.description
    blogModel.websiteUrl = blog.websiteUrl
    blogModel.createdAt = blog.createdAt
    blogModel.isMembership = blog.isMembership

    return blogModel
  }
}

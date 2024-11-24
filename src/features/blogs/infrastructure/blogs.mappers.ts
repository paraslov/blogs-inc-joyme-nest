import { BlogViewDto } from '../api/models/output/blog-view.dto'
import { Injectable } from '@nestjs/common'
import { BlogSql } from '../domain/postgres/blog.sql'

@Injectable()
export class BlogsMappers {
  mapBlogToOutput(blog: BlogSql): BlogViewDto {
    if (!blog) {
      return null
    }

    const blogModel = new BlogViewDto()

    blogModel.id = blog.id
    blogModel.name = blog.name
    blogModel.description = blog.description
    blogModel.websiteUrl = blog.website_url
    blogModel.createdAt = blog.created_at
    blogModel.isMembership = blog.is_membership

    return blogModel
  }
}

import { Injectable } from '@nestjs/common'
import { BlogDocument } from '../domain/mongoose/blogs.entity'

@Injectable()
export class BlogsRepository {
  async saveBlog(blog: BlogDocument) {
    return blog.save()
  }
}

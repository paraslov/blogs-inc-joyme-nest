import { Injectable } from '@nestjs/common';
import { BlogDocument } from './api/model/mongoose';

@Injectable()
export class BlogsCommandRepository {
  async saveBlog(blog: BlogDocument) {
    return blog.save();
  }
}

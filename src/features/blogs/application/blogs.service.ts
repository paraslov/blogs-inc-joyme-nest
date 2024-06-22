import { Injectable } from '@nestjs/common';
import { CreateBlogDto } from '../api/models/input/create-blog.dto';
import { UpdateBlogDto } from '../api/models/input/update-blog.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Blog } from '../domain/mongoose/blogs.entity';
import { Model } from 'mongoose';
import { BlogsRepository } from '../infrastructure/blogs.repository';

@Injectable()
export class BlogsService {
  constructor(
    @InjectModel(Blog.name) private blogModel: Model<Blog>,
    private blogsCommandRepository: BlogsRepository,
  ) {}

  async create(createBlogDto: CreateBlogDto) {
    const createdBlog = new this.blogModel(createBlogDto);

    return await this.blogsCommandRepository.saveBlog(createdBlog);
  }

  async findAll() {
    return this.blogModel.find().exec();
  }

  async findOne(id: string) {
    return this.blogModel.findOne({ _id: id }).exec();
  }

  async update(id: string, updateBlogDto: UpdateBlogDto) {
    return this.blogModel.updateOne({ _id: id }, updateBlogDto);
  }

  async remove(id: string) {
    await this.blogModel.deleteOne({ _id: id });

    return;
  }
}

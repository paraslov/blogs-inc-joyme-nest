import { Injectable } from '@nestjs/common';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Blog } from './api/model/mongoose';
import { Model } from 'mongoose';
import { BlogsCommandRepository } from './blogs.command.repository';

@Injectable()
export class BlogsService {
  constructor(
    @InjectModel(Blog.name) private blogModel: Model<Blog>,
    private blogsCommandRepository: BlogsCommandRepository,
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

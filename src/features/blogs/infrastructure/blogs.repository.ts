import { Injectable } from '@nestjs/common'
import { Blog } from '../domain/mongoose/blogs.entity'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { UpdateBlogDto } from '../api/models/input/update-blog.dto'
import { PostEntity, PostsMappers } from '../../posts'

@Injectable()
export class BlogsRepository {
  constructor(
    @InjectModel(Blog.name) private blogsModel: Model<Blog>,
    @InjectModel(PostEntity.name) private postsModel: Model<PostEntity>,
    private postsMappers: PostsMappers,
  ) {}

  async saveBlog(blog: Blog) {
    return new this.blogsModel(blog).save()
  }
  async savePost(post: PostEntity) {
    const newPost = await new this.postsModel(post).save()

    return this.postsMappers.mapPostToOutputDto(newPost)
  }
  async updateBlog(id: string, updateBlog: UpdateBlogDto) {
    const updateResult = await this.blogsModel.updateOne({ _id: id }, updateBlog)

    return Boolean(updateResult.matchedCount)
  }
  async deleteBlog(id: string) {
    const deleteResult = await this.blogsModel.deleteOne({ _id: id })

    return Boolean(deleteResult.deletedCount)
  }
}

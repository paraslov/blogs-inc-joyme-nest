import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Post } from '../domain/mongoose/posts.entity'
import { Model } from 'mongoose'
import { PostsMappers } from './posts.mappers'
import { StandardInputFilters } from '../../../common/models/input/QueryInputParams'

@Injectable()
export class PostsQueryRepository {
  constructor(
    @InjectModel(Post.name) private postsModel: Model<Post>,
    private postsMappers: PostsMappers,
  ) {}

  async getPostById(id: string) {
    const post = await this.postsModel.findById(id)

    return this.postsMappers.mapPostToOutputDto(post)
  }

  async getPostsList(queryFilter: StandardInputFilters, blogId?: string) {
    const { pageNumber, pageSize, sortBy, sortDirection } = queryFilter

    const filter: any = {}
    if (blogId) {
      filter.blogId = blogId
    }

    const posts = await this.postsModel
      .find(filter)
      .sort({ [sortBy]: sortDirection === 'asc' ? 1 : -1 })
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .exec()

    const mappedPosts = posts.map(this.postsMappers.mapPostToOutputDto)
    const totalCount = await this.postsModel.countDocuments(filter)
    const pagesCount = Math.ceil(totalCount / pageSize)

    return {
      totalCount,
      pagesCount,
      pageSize,
      page: pageNumber,
      items: mappedPosts,
    }
  }
}

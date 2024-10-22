import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { PostEntity } from '../domain/mongoose/posts.entity'
import { Model } from 'mongoose'
import { PostsMappers } from './posts.mappers'
import { StandardInputFilters } from '../../../common/models/input/QueryInputParams'
import { LikesRepository } from '../../likes'

@Injectable()
export class PostsQueryRepository {
  constructor(
    @InjectModel(PostEntity.name) private postsModel: Model<PostEntity>,
    private likesRepository: LikesRepository,
    private postsMappers: PostsMappers,
  ) {}

  async getPostById(postId: string, userId?: string) {
    const likeStatus = await this.likesRepository.getUserLikeStatus(postId, userId)
    const post = await this.postsModel.findById(postId)

    return this.postsMappers.mapPostToOutputDto(post, likeStatus)
  }

  async getPostsList(queryFilter: StandardInputFilters, blogId?: string, userId?: string) {
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

    const mappedPostsPromises = posts.map(async (post) => {
      const likeStatus = await this.likesRepository.getUserLikeStatus(post.id, userId)

      return this.postsMappers.mapPostToOutputDto(post, likeStatus)
    })
    const mappedPosts = await Promise.all(mappedPostsPromises)

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

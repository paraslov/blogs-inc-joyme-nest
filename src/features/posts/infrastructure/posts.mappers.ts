import { Injectable } from '@nestjs/common'
import { PostDocument } from '../domain/mongoose/posts.entity'
import { PostOutputDto } from '../api/models/output/post.dto'

@Injectable()
export class PostsMappers {
  mapPostToOutputDto(post: PostDocument) {
    if (!post) {
      return null
    }

    const mappedPost = new PostOutputDto()

    mappedPost.id = post._id.toString()
    mappedPost.title = post.title
    mappedPost.shortDescription = post.shortDescription
    mappedPost.content = post.content
    mappedPost.blogId = post.blogId
    mappedPost.blogName = post.blogName
    mappedPost.createdAt = post.createdAt
    mappedPost.extendedLikeInfo.likesCount = 0
    mappedPost.extendedLikeInfo.dislikesCount = 0
    mappedPost.extendedLikeInfo.myStatus = 'None'
    mappedPost.extendedLikeInfo.newestLikes = []

    return mappedPost
  }
}

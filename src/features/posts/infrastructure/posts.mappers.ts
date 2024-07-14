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
    mappedPost.extendedLikesInfo = {}
    mappedPost.extendedLikesInfo.likesCount = 0
    mappedPost.extendedLikesInfo.dislikesCount = 0
    mappedPost.extendedLikesInfo.myStatus = 'None'
    mappedPost.extendedLikesInfo.newestLikes = []

    return mappedPost
  }
}

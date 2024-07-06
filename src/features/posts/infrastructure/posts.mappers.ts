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
    mappedPost.shorDescription = post.shortDescription
    mappedPost.content = post.content
    mappedPost.blogId = post.blogId
    mappedPost.blogName = post.blogName
    mappedPost.createdAt = post.createdAt
    mappedPost.extendedLikeInfo = post.extendedLikeInfo

    return mappedPost
  }
}

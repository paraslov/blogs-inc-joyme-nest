import { Injectable } from '@nestjs/common'
import { PostDocument } from '../domain/mongoose/posts.entity'
import { PostViewDto } from '../api/models/output/post.view.dto'
import { LikeDetailsViewDto, LikeStatus } from '../../likes'

@Injectable()
export class PostsMappers {
  mapPostToOutputDto(post: PostDocument, threeLatestLikes: LikeDetailsViewDto[] = [], likeStatus?: LikeStatus) {
    if (!post) {
      return null
    }

    const mappedPost = new PostViewDto()

    mappedPost.id = post._id.toString()
    mappedPost.title = post.title
    mappedPost.shortDescription = post.shortDescription
    mappedPost.content = post.content
    mappedPost.blogId = post.blogId
    mappedPost.blogName = post.blogName
    mappedPost.createdAt = post.createdAt
    mappedPost.extendedLikesInfo = {}
    mappedPost.extendedLikesInfo.likesCount = post.likesCount
    mappedPost.extendedLikesInfo.dislikesCount = post.dislikesCount
    mappedPost.extendedLikesInfo.myStatus = likeStatus ?? LikeStatus.NONE
    mappedPost.extendedLikesInfo.newestLikes = threeLatestLikes

    return mappedPost
  }
}

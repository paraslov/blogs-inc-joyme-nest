import { BlogViewDto } from '../api/models/output/blog-view.dto'
import { Injectable } from '@nestjs/common'
import { BlogEntity } from '../domain/postgres/blog.entity'
import { LikeDetailsViewDto, LikeStatus } from '../../likes'
import { PostEntity } from '../domain/postgres/post.entity'
import { PostViewDto } from '../api/models/output/post.view.dto'

@Injectable()
export class BlogsMappers {
  mapBlogToOutput(blog: BlogEntity): BlogViewDto {
    if (!blog) {
      return null
    }

    const blogModel = new BlogViewDto()

    blogModel.id = blog.id
    blogModel.name = blog.name
    blogModel.description = blog.description
    blogModel.websiteUrl = blog.website_url
    blogModel.createdAt = blog.created_at
    blogModel.isMembership = blog.is_membership

    return blogModel
  }

  mapPostToOutputDto(
    post: PostEntity,
    threeLatestLikes: LikeDetailsViewDto[] = [],
    likeStatus: LikeStatus = LikeStatus.NONE,
  ): PostViewDto | null {
    if (!post) {
      return null
    }

    const mappedPost = new PostViewDto()

    mappedPost.id = post.id
    mappedPost.title = post.title
    mappedPost.shortDescription = post.short_description
    mappedPost.content = post.content
    mappedPost.blogId = post.blog_id
    mappedPost.blogName = post.blog_name
    mappedPost.createdAt = post.created_at
    mappedPost.extendedLikesInfo = {}
    mappedPost.extendedLikesInfo.likesCount = post.likes_count
    mappedPost.extendedLikesInfo.dislikesCount = post.dislikes_count
    mappedPost.extendedLikesInfo.myStatus = likeStatus ?? LikeStatus.NONE
    mappedPost.extendedLikesInfo.newestLikes = threeLatestLikes

    return mappedPost
  }
}

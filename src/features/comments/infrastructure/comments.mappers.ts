import { Injectable } from '@nestjs/common'
import { CommentViewDto } from '../api/models/output/comment.view.dto'
import { LikeStatus } from '../../likes'
import { CommentDbModel } from '../domain/postgres/comment-db-model'

@Injectable()
export class CommentsMappers {
  mapEntityToOutputDto(comment: CommentDbModel, likeStatus?: LikeStatus) {
    if (!comment) {
      return null
    }

    const mappedComment = new CommentViewDto()

    mappedComment.id = comment.id
    mappedComment.content = comment.content
    mappedComment.createdAt = comment.created_at

    mappedComment.commentatorInfo = { userId: null, userLogin: null }
    mappedComment.commentatorInfo.userId = comment.user_id
    mappedComment.commentatorInfo.userLogin = comment.user_login

    mappedComment.likesInfo = {}
    mappedComment.likesInfo.likesCount = comment.likes_count
    mappedComment.likesInfo.dislikesCount = comment.dislikes_count
    mappedComment.likesInfo.myStatus = likeStatus ?? LikeStatus.NONE

    return mappedComment
  }
}

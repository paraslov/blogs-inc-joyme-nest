import { Injectable } from '@nestjs/common'
import { CommentDocument } from '../domain/mongoose/comment.entity'
import { CommentViewDto } from '../api/models/output/comment.view.dto'

@Injectable()
export class CommentsMappers {
  mapEntityToOutputDto(comment: CommentDocument) {
    if (!comment) {
      return null
    }

    const mappedComment = new CommentViewDto()

    mappedComment.id = comment._id.toString()
    mappedComment.content = comment.content
    mappedComment.createdAt = comment.createdAt

    mappedComment.commentatorInfo = { userId: null, userLogin: null }
    mappedComment.commentatorInfo.userId = comment.commentatorInfo.userId
    mappedComment.commentatorInfo.userLogin = comment.commentatorInfo.userLogin

    mappedComment.likesInfo = {}
    mappedComment.likesInfo.likesCount = comment.likesCount
    mappedComment.likesInfo.dislikesCount = comment.dislikesCount
    mappedComment.likesInfo.myStatus = undefined

    return mappedComment
  }
}

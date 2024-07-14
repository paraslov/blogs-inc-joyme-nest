import { Injectable } from '@nestjs/common'
import { CommentDocument } from '../domain/mongoose/comment.entity'
import { CommentDto } from '../api/models/output/comment.dto'

@Injectable()
export class CommentsMappers {
  mapEntityToOutputDto(comment: CommentDocument) {
    if (!comment) {
      return null
    }

    const mappedComment = new CommentDto()

    mappedComment.id = comment._id.toString()
    mappedComment.content = comment.content
    mappedComment.createdAt = comment.createdAt
    mappedComment.commentatorInfo = comment.commentatorInfo
    mappedComment.likesInfo.likesCount = comment.likesCount
    mappedComment.likesInfo.dislikesCount = comment.dislikesCount
    mappedComment.likesInfo.myStatus = undefined

    return mappedComment
  }
}

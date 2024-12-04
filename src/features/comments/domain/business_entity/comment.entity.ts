export class CommentatorInfoSchema {
  userId: string
  userLogin: string
}

export class CommentDto {
  parentId: string
  content: string
  createdAt: string
  commentatorInfo: CommentatorInfoSchema
  likesCount: number
  dislikesCount: number
}

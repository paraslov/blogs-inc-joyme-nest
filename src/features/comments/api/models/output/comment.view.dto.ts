export class CommentViewDto {
  id: string
  content: string
  createdAt: string
  commentatorInfo: CommentatorInfoDto
  likesInfo?: LikesInfoDto
}

class CommentatorInfoDto {
  userId: string
  userLogin: string
}

class LikesInfoDto {
  likesCount?: number
  dislikesCount?: number
  myStatus?: string
}

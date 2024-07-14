export class PostOutputDto {
  id: string
  title: string
  shortDescription: string
  content: string
  blogId: string
  blogName: string
  createdAt: string
  extendedLikesInfo?: LikesInfoDto
}

export class LikesInfoDto {
  likesCount?: number
  dislikesCount?: number
  myStatus?: string
  newestLikes?: any[]
}

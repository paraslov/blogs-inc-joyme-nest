import { LikeStatus } from '../../api/models/enums/like-status'

export class Like {
  userId: string
  userLogin: string
  status: LikeStatus
  parentId: string
  createdAt: Date
}

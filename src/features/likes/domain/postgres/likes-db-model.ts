import { LikeStatus } from '../../api/models/enums/like-status'

export class LikesDbModel {
  parent_id: string
  status: LikeStatus
  created_at: Date
  user_id: string
  user_login: string
}

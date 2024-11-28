import { LikeStatus } from '../../api/models/enums/like-status'

export class LikesSql {
  parent_id: string
  status: LikeStatus
  created_at: Date
  user_id: string
  user_login: string
}

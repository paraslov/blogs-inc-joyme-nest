export class CommentDbModel {
  id: string
  parent_id: string
  content: string
  created_at: string
  user_id: string
  user_login: string
  likes_count: number
  dislikes_count: number
}

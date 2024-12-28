import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm'
import { CommentDto } from '../business_entity/comment'

@Entity('comments')
export class CommentEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column('uuid')
  parent_id: string

  @Column({ type: 'varchar', length: 300 })
  content: string

  @CreateDateColumn()
  created_at: string

  @Column('uuid')
  user_id: string

  @Column({ type: 'varchar', length: 10 })
  user_login: string

  @Column({ type: 'integer', nullable: true })
  likes_count: number

  @Column({ type: 'integer', nullable: true })
  dislikes_count: number

  static createCommentModel(comment: CommentDto) {
    const newComment = new CommentEntity()

    newComment.parent_id = comment.parentId
    newComment.content = comment.content
    newComment.created_at = comment.createdAt
    newComment.likes_count = comment.likesCount
    newComment.dislikes_count = comment.dislikesCount
    newComment.user_id = comment.commentatorInfo.userId
    newComment.user_login = comment.commentatorInfo.userLogin

    return newComment
  }
}

import { LikeStatus } from '../../api/models/enums/like-status'
import { Column, CreateDateColumn, Entity, PrimaryColumn } from 'typeorm'

@Entity('likes')
export class LikesDbModel {
  @PrimaryColumn()
  parent_id: string

  @Column({ type: 'enum', enum: LikeStatus })
  status: LikeStatus

  @CreateDateColumn()
  created_at: Date

  @PrimaryColumn()
  user_id: string

  @Column({ type: 'varchar', length: 10 })
  user_login: string
}

import { LikeStatus } from '../../api/models/enums/like-status'
import { Column, CreateDateColumn, Entity, Index, PrimaryColumn } from 'typeorm'
import { Like } from '../business_entity/likes'

@Entity('likes')
export class LikesEntity {
  @PrimaryColumn()
  parent_id: string

  @Column({ type: 'enum', enum: LikeStatus })
  status: LikeStatus

  @CreateDateColumn()
  @Index()
  created_at: Date

  @PrimaryColumn()
  user_id: string

  @Column({ type: 'varchar', length: 10 })
  user_login: string

  static createLikeModel(likeData: Like) {
    const newLike = new LikesEntity()

    newLike.status = likeData.status
    newLike.parent_id = likeData.parentId
    newLike.user_id = likeData.userId
    newLike.user_login = likeData.userLogin
    newLike.created_at = likeData.createdAt

    return newLike
  }
}

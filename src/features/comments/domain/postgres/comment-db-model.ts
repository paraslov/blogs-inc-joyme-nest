import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity('comments')
export class CommentDbModel {
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
}

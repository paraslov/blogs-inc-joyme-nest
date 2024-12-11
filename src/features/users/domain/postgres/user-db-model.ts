import { Column, CreateDateColumn, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm'
import { UserInfo } from './user.info'
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity('users')
export class UserDbModel {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'varchar', unique: true, length: 10 })
  login: string

  @Column({ unique: true })
  email: string

  @Column()
  password_hash: string

  @CreateDateColumn()
  created_at: Date
}

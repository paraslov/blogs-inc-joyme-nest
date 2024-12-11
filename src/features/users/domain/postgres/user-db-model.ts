import { Column, CreateDateColumn, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm'
import { UserInfo } from './user.info'

@Entity('users')
export class UserDbModel {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  login: string

  @Column()
  email: string

  @Column()
  password_hash: string

  @CreateDateColumn()
  created_at: Date

  @OneToOne(() => UserInfo, (userConfirmationInfo) => userConfirmationInfo.user)
  user_confirmation_info: UserInfo
}

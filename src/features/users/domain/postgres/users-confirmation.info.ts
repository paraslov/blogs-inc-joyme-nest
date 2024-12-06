import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm'
import { Users } from './user-db-model'

export class UserInfo {
  user_id: string
  confirmation_code: string
  confirmation_code_expiration_date: Date
  is_confirmed: boolean
  password_recovery_code: string | null
  password_recovery_code_expiration_date: Date | null
  is_password_recovery_confirmed: boolean | null
}

@Entity()
export class UsersConfirmationInfo {
  @PrimaryColumn('uuid')
  user_id: string

  @Column({ type: 'uuid', unique: true })
  confirmation_code: string

  @Column()
  confirmation_code_expiration_date: Date

  @Column()
  is_confirmed: boolean

  @Column({ type: 'uuid', unique: true, nullable: true })
  password_recovery_code: string | null

  @Column({ nullable: true })
  password_recovery_code_expiration_date: Date | null

  @Column({ nullable: true })
  is_password_recovery_confirmed: boolean | null

  @OneToOne(() => Users, (user) => user.user_confirmation_info,  { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: Users
}

import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm'
import { UserEntity } from './user.entity'
import { UserConfirmationData } from '../business_entity/users'

@Entity('users_confirmation_info')
export class UserInfoEntity {
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

  @OneToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity

  static createUserInfo(userConfirmationData: UserConfirmationData, userId: string) {
    const newUserInfo: UserInfoEntity = new UserInfoEntity()

    newUserInfo.user_id = userId
    newUserInfo.confirmation_code = userConfirmationData.confirmationCode
    newUserInfo.is_confirmed = userConfirmationData.isConfirmed
    newUserInfo.confirmation_code_expiration_date = userConfirmationData.confirmationCodeExpirationDate

    return newUserInfo
  }
}

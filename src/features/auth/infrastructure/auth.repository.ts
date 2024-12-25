import { Injectable } from '@nestjs/common'
import { Repository } from 'typeorm'
import { UserDbModel, UserInfo } from '../../users'
import { InjectRepository } from '@nestjs/typeorm'

@Injectable()
export class AuthRepository {
  constructor(
    @InjectRepository(UserDbModel) private usersOrmRepository: Repository<UserDbModel>,
    @InjectRepository(UserInfo) private usersInfoOrmRepository: Repository<UserInfo>,
  ) {}

  private userInfoSelectFields = [
    'ui.confirmation_code',
    'ui.confirmation_code_expiration_date',
    'ui.is_confirmed',
    'ui.password_recovery_code',
    'ui.password_recovery_code_expiration_date',
    'ui.is_password_recovery_confirmed',
  ]

  async getUserByLoginOrEmail(loginOrEmail: string): Promise<{ user: UserDbModel; userInfo: UserInfo } | null> {
    const user = await this.usersOrmRepository
      .createQueryBuilder('u')
      .select(['u.id', 'u.email', 'u.login', 'u.password_hash', 'u.created_at'])
      .where('u.login = :loginOrEmail', { loginOrEmail })
      .orWhere('u.email = :loginOrEmail', { loginOrEmail })
      .getOne()

    if (!user) {
      return null
    }

    const userInfo = await this.usersInfoOrmRepository
      .createQueryBuilder('ui')
      .select(this.userInfoSelectFields)
      .where('ui.user_id = :userId', { userId: user.id })
      .getOne()

    if (!userInfo) {
      return null
    }

    return { user, userInfo }
  }

  async getUserInfoByConfirmationCode(confirmationCode: string): Promise<UserInfo | null> {
    const userInfo = await this.usersInfoOrmRepository
      .createQueryBuilder('ui')
      .select(this.userInfoSelectFields)
      .where('ui.confirmation_code = :confirmationCode', { confirmationCode })
      .getOne()

    return userInfo ?? null
  }

  async getUserInfoByRecoveryCode(passwordRecoveryCode: string): Promise<UserInfo | null> {
    const userInfo = await this.usersInfoOrmRepository
      .createQueryBuilder('ui')
      .select([...this.userInfoSelectFields, 'ui.user_id'])
      .where('ui.password_recovery_code = :passwordRecoveryCode', { passwordRecoveryCode })
      .getOne()

    return userInfo ?? null
  }
}
import { Injectable } from '@nestjs/common'
import { DataSource, Repository } from 'typeorm'
import { UserInfo, UserDbModel } from '../../users'
import { InjectRepository } from '@nestjs/typeorm'

@Injectable()
export class AuthRepository {
  constructor(
    protected dataSource: DataSource,
    @InjectRepository(UserDbModel) private usersOrmRepository: Repository<UserDbModel>,
    @InjectRepository(UserInfo) private usersInfoOrmRepository: Repository<UserInfo>,
  ) {}

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
      .select([
        'ui.confirmation_code',
        'ui.confirmation_code_expiration_date',
        'ui.is_confirmed',
        'ui.password_recovery_code',
        'ui.password_recovery_code_expiration_date',
        'ui.is_password_recovery_confirmed',
      ])
      .where('ui.user_id = :userId', { userId: user.id })
      .getOne()

    if (!userInfo) {
      return null
    }

    return { user, userInfo }
  }

  async getUserInfoByConfirmationCode(confirmationCode: string): Promise<UserInfo | null> {
    const userInfos = await this.dataSource.query(
      `
        SELECT user_id, confirmation_code, confirmation_code_expiration_date, is_confirmed, password_recovery_code,
          password_recovery_code_expiration_date, is_password_recovery_confirmed
            FROM public.users_confirmation_info
            WHERE confirmation_code=$1;
    `,
      [confirmationCode],
    )

    return userInfos?.[0] ?? null
  }

  async getUserInfoByRecoveryCode(passwordRecoveryCode: string): Promise<UserInfo | null> {
    const userInfos = await this.dataSource.query(
      `
        SELECT user_id, confirmation_code, confirmation_code_expiration_date, is_confirmed, password_recovery_code,
          password_recovery_code_expiration_date, is_password_recovery_confirmed
            FROM public.users_confirmation_info
            WHERE password_recovery_code=$1;
    `,
      [passwordRecoveryCode],
    )

    return userInfos?.[0] ?? null
  }
}

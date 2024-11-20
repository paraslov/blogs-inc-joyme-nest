import { Injectable } from '@nestjs/common'
import { DataSource } from 'typeorm'
import { UserInfo, UserSql } from '../../users'

@Injectable()
export class AuthSqlRepository {
  constructor(protected dataSource: DataSource) {}

  async getUserByLoginOrEmail(loginOrEmail: string): Promise<UserSql | null> {
    const users = await this.dataSource.query(
      `
      SELECT id, login, email, password_hash, created_at
              FROM public.users
              WHERE login = $1 OR email = $1
    `,
      [loginOrEmail],
    )

    if (users.length !== 1) {
      return null
    }

    return users[0]
  }

  async getUserConfirmationInfoByUserId(userId: string): Promise<UserInfo | null> {
    const user = await this.dataSource.query(
      `
      SELECT user_id, confirmation_code, confirmation_code_expiration_date, is_confirmed,
        password_recovery_code, password_recovery_code_expiration_date, is_password_recovery_confirmed
          FROM public.users_confirmation_info
          WHERE user_id = $1;
    `,
      [userId],
    )

    if (user?.length !== 1) {
      return null
    }

    return user?.[0]
  }
}

import { Injectable } from '@nestjs/common'
import { DataSource } from 'typeorm'
import { UsersSqlEntity } from '../../users'

@Injectable()
export class AuthSqlRepository {
  constructor(protected dataSource: DataSource) {}

  async getUserByLoginOrEmail(loginOrEmail: string): Promise<UsersSqlEntity | null> {
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
}

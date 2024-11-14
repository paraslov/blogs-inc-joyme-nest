import { Injectable } from '@nestjs/common'
import { InjectDataSource } from '@nestjs/typeorm'
import { DataSource } from 'typeorm'

@Injectable()
export class UsersSqlQueryRepository {
  constructor(@InjectDataSource() protected dataSource: DataSource) {}

  async getUser(userId: string) {
    const res = await this.dataSource.query(
      `SELECT u.id, u.login, u.email, u."passwordHash", u."createdAt", uci.*
      FROM public.users u
      LEFT JOIN public."usersConfirmationInfo" uci
      ON u.id = uci."userId"
      WHERE u.id=$1;`,
      [userId],
    )

    return res[0]
  }
}

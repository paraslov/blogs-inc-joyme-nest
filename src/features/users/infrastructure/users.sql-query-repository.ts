import { Injectable } from '@nestjs/common'
import { InjectDataSource } from '@nestjs/typeorm'
import { DataSource } from 'typeorm'
import { UsersMappers } from './users.mappers'
import { FilterUsersDto } from '../api/models/input/filter-users.dto'

@Injectable()
export class UsersSqlQueryRepository {
  constructor(
    @InjectDataSource() protected dataSource: DataSource,
    protected usersMappers: UsersMappers,
  ) {}

  async getUser(userId: string) {
    const res = await this.dataSource.query(
      `SELECT u.id, u.login, u.email, u."passwordHash", u."createdAt", uci."confirmationCode",
                uci."confirmationExpirationDate", uci."isConfirmed",
                uci."passwordRecoveryCode", uci."passwordRecoveryCodeExpirationDate", uci."isPasswordRecoveryConfirmed"
      FROM public.users u
      LEFT JOIN public."usersConfirmationInfo" uci
      ON u.id = uci."userId"
      WHERE u.id=$1;`,
      [userId],
    )

    return this.usersMappers.mapSqlToOutputDto(res[0])
  }

  async getUsers(query: FilterUsersDto) {
    const offset = (query.pageNumber - 1) * query.pageSize

    const res = await this.dataSource.query(
      `SELECT id, login, email, "passwordHash", "createdAt"
              FROM public.users
              WHERE 
                login ILIKE '%' || $3 || '%' OR
                email ILIKE '%' || $4 || '%'
              ORDER BY "createdAt" DESC
              LIMIT $1 OFFSET $2;`,
      [query.pageSize, offset, query.searchLoginTerm, query.searchEmailTerm],
    )

    return res.map(this.usersMappers.mapSqlToOutputDto)
  }
}

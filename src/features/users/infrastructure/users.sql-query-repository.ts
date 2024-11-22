import { Injectable } from '@nestjs/common'
import { InjectDataSource } from '@nestjs/typeorm'
import { DataSource } from 'typeorm'
import { UsersMappers } from './users.mappers'
import { FilterUsersDto } from '../api/models/input/filter-users.dto'
import { SortDirection } from '../../../common/models/enums/sort-direction'
import { camelToSnakeUtil } from '../../../common/utils'

@Injectable()
export class UsersSqlQueryRepository {
  constructor(
    @InjectDataSource() protected dataSource: DataSource,
    protected usersMappers: UsersMappers,
  ) {}

  async getUser(userId: string) {
    const res = await this.dataSource.query(
      `SELECT u.id, u.login, u.email, u.password_hash, u.created_at,
                uci.confirmation_code, uci.confirmation_code_expiration_date, uci.is_confirmed,
                uci.password_recovery_code, uci.password_recovery_code_expiration_date,
                uci.is_password_recovery_confirmed
      FROM public.users u
      LEFT JOIN public.users_confirmation_info uci
      ON u.id = uci.user_id
      WHERE u.id=$1;`,
      [userId],
    )

    return this.usersMappers.mapSqlToOutputDto(res[0])
  }

  async getUsers(query: FilterUsersDto) {
    const offset = (query.pageNumber - 1) * query.pageSize
    const direction = query.sortDirection === SortDirection.DESC ? 'DESC' : 'ASC'
    const sortBySnakeCase = camelToSnakeUtil(query.sortBy)

    const totalCountResult = await this.dataSource.query(
      `SELECT COUNT(*) AS "totalCount"
     FROM public.users
     WHERE 
       login ILIKE '%' || $1 || '%' AND
       email ILIKE '%' || $2 || '%'`,
      [query.searchLoginTerm, query.searchEmailTerm],
    )
    const totalCount = parseInt(totalCountResult[0].totalCount, 10)

    const res = await this.dataSource.query(
      `SELECT id, login, email, password_hash, created_at
              FROM public.users
              WHERE 
                login ILIKE '%' || $3 || '%' OR
                email ILIKE '%' || $4 || '%'
              ORDER BY "${sortBySnakeCase}" ${direction}
              LIMIT $1 OFFSET $2;`,
      [query.pageSize, offset, query.searchLoginTerm, query.searchEmailTerm],
    )

    const mappedUsers = res.map(this.usersMappers.mapSqlToOutputDto)
    const pagesCount = Math.ceil(totalCount / query.pageSize)

    return {
      pagesCount,
      totalCount,
      pageSize: query.pageSize,
      page: query.pageNumber,
      items: mappedUsers,
    }
  }
}

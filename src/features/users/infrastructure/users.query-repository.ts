import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { UsersMappers } from './users.mappers'
import { FilterUsersDto } from '../api/models/input/filter-users.dto'
import { SortDirection } from '../../../common/models/enums/sort-direction'
import { camelToSnakeUtil } from '../../../common/utils'
import { UserDbModel } from '../domain/postgres/user-db-model'

@Injectable()
export class UsersQueryRepository {
  constructor(
    @InjectRepository(UserDbModel) private usersOrmRepository: Repository<UserDbModel>,
    protected usersMappers: UsersMappers,
  ) {}

  async getUser(userId: string) {
    const user = await this.usersOrmRepository.findOneBy({ id: userId })

    return this.usersMappers.mapToOutputDto(user)
  }

  async getUsers(query: FilterUsersDto) {
    const offset = (query.pageNumber - 1) * query.pageSize
    const direction = query.sortDirection === SortDirection.DESC ? 'DESC' : 'ASC'
    const sortBySnakeCase = camelToSnakeUtil(query.sortBy)

    const [users, totalCount] = await this.usersOrmRepository
      .createQueryBuilder('user')
      .select(['user.id', 'user.login', 'user.email', 'user.created_at'])
      .where('user.login ILIKE :searchLoginTerm', { searchLoginTerm: `%${query.searchLoginTerm || ''}%` })
      .orWhere('user.email ILIKE :searchEmailTerm', { searchEmailTerm: `%${query.searchEmailTerm || ''}%` })
      .orderBy(`user.${sortBySnakeCase}`, direction)
      .skip(offset)
      .take(query.pageSize)
      .getManyAndCount()

    const mappedUsers = users.map(this.usersMappers.mapToOutputDto)
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

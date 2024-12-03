import { Injectable } from '@nestjs/common'
import { UserViewDto } from '../api/models/output/userViewDto'

@Injectable()
export class UsersMappers {
  mapSqlToOutputDto(userSql: any) {
    if (!userSql?.id) {
      return null
    }

    const mappedUser = new UserViewDto()
    mappedUser.id = userSql.id
    mappedUser.email = userSql.email
    mappedUser.login = userSql.login
    mappedUser.createdAt = userSql.created_at

    return mappedUser
  }
}

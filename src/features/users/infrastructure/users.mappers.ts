import { Injectable } from '@nestjs/common'
import { UserDocument } from '../domain/mongoose/users.entity'
import { UserViewDto } from '../api/models/output/userViewDto'

@Injectable()
export class UsersMappers {
  mapDbToOutputDto(user: UserDocument) {
    if (!user) {
      return null
    }

    const mappedUser = new UserViewDto()

    mappedUser.id = user._id.toString()
    mappedUser.email = user.userData.email
    mappedUser.login = user.userData.login
    mappedUser.createdAt = user.userData.createdAt

    return mappedUser
  }
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

import { Injectable } from '@nestjs/common'
import { UserViewDto } from '../api/models/output/userViewDto'
import { UserEntity } from '../domain/postgres/user.entity'

@Injectable()
export class UsersMappers {
  mapToOutputDto(user: UserEntity) {
    if (!user?.id) {
      return null
    }

    const mappedUser = new UserViewDto()
    mappedUser.id = user.id
    mappedUser.email = user.email
    mappedUser.login = user.login
    mappedUser.createdAt = user.created_at.toISOString()

    return mappedUser
  }
}

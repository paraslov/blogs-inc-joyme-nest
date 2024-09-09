import { Injectable } from '@nestjs/common'
import { UserDocument } from '../domain/mongoose/users.entity'
import { UserDto } from '../api/models/output/user.dto'

@Injectable()
export class UsersMappers {
  mapDbToOutputDto(user: UserDocument) {
    if (!user) {
      return null
    }

    const mappedUser = new UserDto()

    mappedUser.id = user._id.toString()
    mappedUser.email = user.userData.email
    mappedUser.login = user.userData.login
    mappedUser.createdAt = user.userData.createdAt

    return mappedUser
  }
}

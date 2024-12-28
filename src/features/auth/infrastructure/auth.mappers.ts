import { Injectable } from '@nestjs/common'
import { UserEntity } from '../../users'
import { MeViewModelDto } from '../api/models/output/me-view-model.dto'

@Injectable()
export class AuthMappers {
  mapDbToOutputDto(user: UserEntity) {
    if (!user) {
      return null
    }

    const meViewModelDto = new MeViewModelDto()

    meViewModelDto.userId = user.id
    meViewModelDto.email = user.email
    meViewModelDto.login = user.login

    return meViewModelDto
  }
}

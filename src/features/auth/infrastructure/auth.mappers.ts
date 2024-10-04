import { Injectable } from '@nestjs/common'
import { UserDocument } from '../../users'
import { MeViewModelDto } from '../api/models/output/me-view-model.dto'

@Injectable()
export class AuthMappers {
  mapDbToOutputDto(user: UserDocument) {
    if (!user) {
      return null
    }

    const meViewModelDto = new MeViewModelDto()

    meViewModelDto.userId = user._id.toString()
    meViewModelDto.email = user.userData.email
    meViewModelDto.login = user.userData.login

    return meViewModelDto
  }
}

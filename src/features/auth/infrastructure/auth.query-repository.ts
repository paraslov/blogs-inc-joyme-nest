import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { User } from '../../users'
import { Model } from 'mongoose'
import { AuthMappers } from './auth.mappers'

@Injectable()
export class AuthQueryRepository {
  constructor(
    @InjectModel(User.name) private readonly usersModel: Model<User>,
    private readonly authMappers: AuthMappers,
  ) {}

  async getMeInformation(userId: string) {
    const user = await this.usersModel.findOne({ _id: userId })

    return this.authMappers.mapDbToOutputDto(user)
  }
}

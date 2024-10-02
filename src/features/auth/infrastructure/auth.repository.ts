import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { User } from '../../users'
import { Model } from 'mongoose'

@Injectable()
export class AuthRepository {
  constructor(@InjectModel(User.name) private readonly usersModel: Model<User>) {}

  async getUserByLoginOrEmail(loginOrEmail: string) {
    const users = await this.usersModel.find({
      $or: [{ 'userData.login': loginOrEmail }, { 'userData.email': loginOrEmail }],
    })

    if (users.length !== 1) {
      return false
    }

    return users[0]
  }
  async getUserByConfirmationCode(confirmationCode: string) {
    return this.usersModel.findOne({ 'userConfirmationData.confirmationCode': confirmationCode })
  }
}

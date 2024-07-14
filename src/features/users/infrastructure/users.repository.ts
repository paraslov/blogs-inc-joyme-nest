import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { User } from '../domain/mongoose/users.entity'
import { Model } from 'mongoose'
import { UsersMappers } from './users.mappers'

@Injectable()
export class UsersRepository {
  constructor(
    @InjectModel(User.name) private usersModel: Model<User>,
    private usersMappers: UsersMappers,
  ) {}

  async saveUser(user: User) {
    const savedUser = await new this.usersModel(user).save()

    return this.usersMappers.mapDbToOutputDto(savedUser)
  }
  async deleteUser(id: string) {
    const deleteResult = await this.usersModel.deleteOne({ _id: id })

    return Boolean(deleteResult.deletedCount)
  }
}

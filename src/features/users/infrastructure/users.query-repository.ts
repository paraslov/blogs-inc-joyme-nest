import { Injectable } from '@nestjs/common'
import { FilterUsersDto } from '../api/models/input/filter-users.dto'
import { InjectModel } from '@nestjs/mongoose'
import { User } from '../domain/mongoose/users.entity'
import { Model } from 'mongoose'
import { UsersMappers } from './users.mappers'

@Injectable()
export class UsersQueryRepository {
  constructor(
    @InjectModel(User.name) private usersModel: Model<User>,
    private usersMappers: UsersMappers,
  ) {}

  async getUsers(query: FilterUsersDto) {
    const { pageNumber, pageSize, sortDirection, sortBy, searchLoginTerm, searchEmailTerm } = query

    const filter: any = {}

    if (searchEmailTerm || searchLoginTerm) {
      filter.$or = []

      if (searchLoginTerm) {
        filter.$or.push({ 'userData.login': { $regex: searchLoginTerm, $options: 'i' } })
      }
      if (searchEmailTerm) {
        filter.$or.push({ 'userData.login': { $regex: searchEmailTerm, $options: 'i' } })
      }
    }

    const users = await this.usersModel
      .find(filter)
      .sort({ [sortBy]: sortDirection === 'asc' ? 1 : -1 })
      .skip(pageSize * (pageNumber - 1))
      .limit(pageSize)
      .exec()

    const totalCount = await this.usersModel.countDocuments(filter)
    const pagesCount = Math.ceil(totalCount / pageSize)
    const mappedUsers = users.map(this.usersMappers.mapDbToOutputDto)

    return {
      pagesCount,
      totalCount,
      pageSize,
      page: pageNumber,
      items: mappedUsers,
    }
  }
  async getUserByLoginOrEmail(loginOrEmail: string) {
    const users = await this.usersModel.find({
      $or: [{ 'userData.login': loginOrEmail }, { 'userData.email': loginOrEmail }],
    })

    if (users.length !== 1) {
      return false
    }

    return users[0]
  }
}

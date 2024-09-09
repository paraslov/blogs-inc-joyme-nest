// import { Injectable } from '@nestjs/common'
// import { InjectModel } from '@nestjs/mongoose'
// import { User } from '../../users'
// import { Model } from 'mongoose'
// import { AuthMappers } from './auth.mappers'
//
// @Injectable()
// export class AuthQueryRepository {
//   constructor(
//     @InjectModel(User.name) private usersModel: Model<User>,
//     private authMappers: AuthMappers,
//   ) {}
//   async findUserById(id: string) {
//     const foundUser = await this.usersModel.findById(id)
//
//     return this.authMappers.mapDbToOutputDto(foundUser)
//   }
// }

import { Injectable } from '@nestjs/common'

@Injectable()
export class UsersQueryRepository {
  async getUsers() {
    return 'users'
  }
}

import { Injectable } from '@nestjs/common'

@Injectable()
export class UsersService {
  constructor() {}

  async createUser() {
    return 'created user'
  }
}

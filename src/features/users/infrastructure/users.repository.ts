import { Injectable } from '@nestjs/common'

@Injectable()
export class UsersRepository {
  async saveUser() {
    return 'saved user'
  }
}

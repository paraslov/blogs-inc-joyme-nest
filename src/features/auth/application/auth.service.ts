import { Injectable } from '@nestjs/common'
import { UsersQueryRepository } from '../../users/infrastructure/users.query-repository'

@Injectable()
export class AuthService {
  constructor(private usersQueryRepository: UsersQueryRepository) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersQueryRepository.getUserByLoginOrEmail(username)
    if (user && user.login === username) {
      const { login } = user
      return login
    }
    return null
  }
}

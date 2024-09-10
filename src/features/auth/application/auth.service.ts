import { Injectable } from '@nestjs/common'
import { UsersQueryRepository } from '../../users/infrastructure/users.query-repository'
import { CryptService } from '../../../common/services'

@Injectable()
export class AuthService {
  constructor(
    private usersQueryRepository: UsersQueryRepository,
    private cryptService: CryptService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.usersQueryRepository.getUserByLoginOrEmail(username)
    if (!user) {
      return null
    }

    const isPasswordValid = await this.cryptService.checkPassword(password, user.userData.passwordHash)

    if (!isPasswordValid) {
      return null
    }

    return null
  }
}

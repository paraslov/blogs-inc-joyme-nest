import { Injectable } from '@nestjs/common'
import { UsersQueryRepository } from '../../users/infrastructure/users.query-repository'
import { CryptService, JwtService } from '../../../common/services'
import { v4 as uuidv4 } from 'uuid'

@Injectable()
export class AuthService {
  constructor(
    private usersQueryRepository: UsersQueryRepository,
    private cryptService: CryptService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    console.log('BOOOLT')
    const user = await this.usersQueryRepository.getUserByLoginOrEmail(username)
    if (!user) {
      return null
    }

    const isPasswordValid = await this.cryptService.checkPassword(password, user.userData.passwordHash)

    if (!isPasswordValid) {
      return null
    }

    const deviceId = uuidv4()
    const { accessToken, refreshToken } = await this.jwtService.createTokenPair(user._id.toString(), deviceId)

    if (accessToken && refreshToken) {
      return { accessToken, refreshToken }
    }

    return null
  }
}

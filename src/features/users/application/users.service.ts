import { Injectable } from '@nestjs/common'
import { UsersRepository } from '../infrastructure/users.repository'
import { CreateUserDto } from '../api/models/input/create-user.dto'
import { User } from '../domain/mongoose/users.entity'
import { CryptService } from '../../../common/services'

@Injectable()
export class UsersService {
  constructor(
    private usersRepository: UsersRepository,
    private cryptService: CryptService,
  ) {}

  async createUser(createUserDto: CreateUserDto) {
    const passwordHash = await this.cryptService.generateHash(createUserDto.password)

    const newUser: User = {
      userData: {
        login: createUserDto.login,
        email: createUserDto.email,
        passwordHash: passwordHash,
        createdAt: new Date().toISOString(),
      },
      userConfirmationData: {
        confirmationCode: 'default_code',
        confirmationCodeExpirationDate: new Date(),
        isConfirmed: true,
      },
    }

    return this.usersRepository.saveUser(newUser)
  }
  async deleteUser(id: string) {
    return this.usersRepository.deleteUser(id)
  }
}

import { Injectable } from '@nestjs/common'
import { UsersRepository } from '../infrastructure/users.repository'
import { CreateUserDto } from '../api/models/input/create-user.dto'
import { User } from '../domain/mongoose/users.entity'

@Injectable()
export class UsersService {
  constructor(private usersRepository: UsersRepository) {}

  async createUser(createUserDto: CreateUserDto) {
    const newUser: User = {
      ...createUserDto,
      createdAt: new Date().toISOString(),
    }

    return this.usersRepository.saveUser(newUser)
  }
  async deleteUser(id: string) {
    return this.usersRepository.deleteUser(id)
  }
}

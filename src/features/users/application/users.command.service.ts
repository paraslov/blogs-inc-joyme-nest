import { Injectable } from '@nestjs/common'
import { CreateUserDto } from '../api/models/input/create-user.dto'
import { CreateUserCommand } from './commands/create-user.command'
import { CommandBus } from '@nestjs/cqrs'
import { DeleteUserCommand } from './commands/delete-user.command'

@Injectable()
export class UsersCommandService {
  constructor(private readonly commandBus: CommandBus) {}

  createUser(createUserDto: CreateUserDto) {
    const command = new CreateUserCommand(createUserDto)

    return this.commandBus.execute(command)
  }

  deleteUser(userId: string) {
    const command = new DeleteUserCommand(userId)

    return this.commandBus.execute(command)
  }
}

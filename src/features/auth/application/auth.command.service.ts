import { Injectable } from '@nestjs/common'
import { RegisterUserCommand } from './commands/register-user.command'
import { CommandBus } from '@nestjs/cqrs'
import { CreateUserDto } from '../../users'

@Injectable()
export class AuthCommandService {
  constructor(private commandBus: CommandBus) {}

  async registerUser(createUserDto: CreateUserDto) {
    const command = new RegisterUserCommand(createUserDto)

    return this.commandBus.execute(command)
  }
}

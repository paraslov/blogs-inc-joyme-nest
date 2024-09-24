import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { CreateUserDto } from '../../../users'

export class RegisterUserCommand {
  constructor(public readonly createUserDto: CreateUserDto) {}
}

@CommandHandler(RegisterUserCommand)
export class RegisterUserHandler implements ICommandHandler<RegisterUserCommand> {
  async execute(command: RegisterUserCommand) {
    const { createUserDto } = command

    return createUserDto
  }
}

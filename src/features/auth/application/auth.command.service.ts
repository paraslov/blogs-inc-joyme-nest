import { Injectable } from '@nestjs/common'
import { RegisterUserCommand } from './commands/register-user.command'
import { CommandBus } from '@nestjs/cqrs'
import { CreateUserDto } from '../../users'
import { ConfirmUserCommand } from './commands/confirm-user.command'
import { InterlayerDataManager } from '../../../common/manager'

@Injectable()
export class AuthCommandService {
  constructor(private commandBus: CommandBus) {}

  registerUser(createUserDto: CreateUserDto) {
    const command = new RegisterUserCommand(createUserDto)

    return this.commandBus.execute<RegisterUserCommand, InterlayerDataManager>(command)
  }

  confirmUser(confirmationCode: string) {
    const command = new ConfirmUserCommand(confirmationCode)

    return this.commandBus.execute<ConfirmUserCommand, InterlayerDataManager>(command)
  }
}

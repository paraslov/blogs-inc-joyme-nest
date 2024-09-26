import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'

export class ConfirmUserCommand {
  constructor(public readonly confirmationCode: string) {}
}

@CommandHandler(ConfirmUserCommand)
export class ConfirmUserHandler implements ICommandHandler<ConfirmUserCommand> {
  async execute(command: ConfirmUserCommand) {
    const { confirmationCode } = command

    return confirmationCode
  }
}

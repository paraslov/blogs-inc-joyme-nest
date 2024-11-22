import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { UsersSqlRepository } from '../../infrastructure/users.sql-repository'

export class DeleteUserCommand {
  constructor(public readonly userId: string) {}
}

@CommandHandler(DeleteUserCommand)
export class DeleteUserHandler implements ICommandHandler<DeleteUserCommand> {
  constructor(private readonly usersRepository: UsersSqlRepository) {}

  execute(command: DeleteUserCommand) {
    const { userId } = command

    return this.usersRepository.deleteUser(userId)
  }
}

import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { UsersRepository } from '../../../users'
import { InterlayerDataManager } from '../../../../common/manager'
import { HttpStatusCodes } from '../../../../common/models'
import { AuthRepository } from '../../infrastructure/auth.repository'

export class ConfirmUserCommand {
  constructor(public readonly confirmationCode: string) {}
}

@CommandHandler(ConfirmUserCommand)
export class ConfirmUserHandler implements ICommandHandler<ConfirmUserCommand> {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly usersRepository: UsersRepository,
  ) {}
  async execute(command: ConfirmUserCommand) {
    const { confirmationCode } = command
    const notice = new InterlayerDataManager()
    const userToConfirm = await this.authRepository.getUserByConfirmationCode(confirmationCode)

    if (!userToConfirm) {
      notice.addError('Incorrect verification code', 'code', HttpStatusCodes.BAD_REQUEST_400)

      return notice
    }
    if (userToConfirm.userConfirmationData.isConfirmed) {
      notice.addError('Registration was already confirmed', 'code', HttpStatusCodes.BAD_REQUEST_400)

      return notice
    }
    if (userToConfirm.userConfirmationData.confirmationCodeExpirationDate < new Date()) {
      notice.addError('Confirmation code expired', 'code', HttpStatusCodes.BAD_REQUEST_400)

      return notice
    }

    const confirmationResult = await this.usersRepository.confirmUser(confirmationCode)
    if (!confirmationResult) {
      notice.addError('Ups! Something goes wrong...', 'code', HttpStatusCodes.BAD_REQUEST_400)
    }

    return notice
  }
}

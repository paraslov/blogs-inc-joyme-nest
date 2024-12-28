import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { UserInfoEntity, UsersRepository } from '../../../users'
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
    const userToConfirm = await this.authRepository.getUserInfoByConfirmationCode(confirmationCode)

    const resultNotice = this.checkUserToConfirm(userToConfirm)
    if (resultNotice.hasError()) {
      return resultNotice
    }

    const confirmationResult = await this.usersRepository.confirmUser(confirmationCode)
    if (!confirmationResult) {
      resultNotice.addError('Ups! Something goes wrong...', 'code', HttpStatusCodes.BAD_REQUEST_400)
    }

    return resultNotice
  }

  checkUserToConfirm(userToConfirm: UserInfoEntity | null) {
    const notice = new InterlayerDataManager()

    if (!userToConfirm) {
      notice.addError('Incorrect verification code', 'code', HttpStatusCodes.BAD_REQUEST_400)

      return notice
    }
    if (userToConfirm.is_confirmed) {
      notice.addError('Registration was already confirmed', 'code', HttpStatusCodes.BAD_REQUEST_400)

      return notice
    }
    if (userToConfirm.confirmation_code_expiration_date < new Date()) {
      notice.addError('Confirmation code expired', 'code', HttpStatusCodes.BAD_REQUEST_400)

      return notice
    }

    return notice
  }
}

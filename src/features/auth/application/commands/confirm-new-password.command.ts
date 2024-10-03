import { PasswordRecoveryDto } from '../../api/models/input/password-recovery.dto'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { AuthRepository } from '../../infrastructure/auth.repository'
import { InterlayerDataManager } from '../../../../common/manager'
import { HttpStatusCodes } from '../../../../common/models'
import { User, UsersRepository } from '../../../users'
import { CryptService } from '../../../../common/services'

export class ConfirmNewPasswordCommand {
  constructor(public readonly passwordRecoveryDto: PasswordRecoveryDto) {}
}

@CommandHandler(ConfirmNewPasswordCommand)
export class ConfirmNewPasswordHandler implements ICommandHandler<ConfirmNewPasswordCommand> {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly cryptService: CryptService,
    private readonly usersRepository: UsersRepository,
  ) {}

  async execute(command: ConfirmNewPasswordCommand) {
    const { passwordRecoveryDto } = command

    const user = await this.authRepository.getUserByRecoveryCode(passwordRecoveryDto.recoveryCode)
    const resultNotice = this.validateUser(user)

    if (resultNotice.hasError()) {
      return resultNotice
    }

    const newPasswordHash = await this.cryptService.generateHash(passwordRecoveryDto.newPassword)
    user.userData.passwordHash = newPasswordHash
    user.userConfirmationData.isPasswordRecoveryConfirmed = true

    await this.usersRepository.saveUser(user)

    return resultNotice
  }

  validateUser(user?: User) {
    const notice = new InterlayerDataManager()

    if (!user) {
      notice.addError('Incorrect verification code', 'recoveryCode', HttpStatusCodes.BAD_REQUEST_400)

      return notice
    }
    if (user.userConfirmationData.isPasswordRecoveryConfirmed) {
      notice.addError('Recovery was already confirmed', 'recoveryCode', HttpStatusCodes.BAD_REQUEST_400)
    }
    if (user.userConfirmationData.passwordRecoveryCodeExpirationDate < new Date()) {
      notice.addError('Recovery code expired', 'recoveryCode', HttpStatusCodes.BAD_REQUEST_400)
    }

    return notice
  }
}

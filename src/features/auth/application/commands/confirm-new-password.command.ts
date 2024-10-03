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
  notice = new InterlayerDataManager()

  async execute(command: ConfirmNewPasswordCommand) {
    const { passwordRecoveryDto } = command

    const user = await this.authRepository.getUserByRecoveryCode(passwordRecoveryDto.recoveryCode)
    this.validateUser(user)

    if (this.notice.hasError()) {
      return this.notice
    }

    const newPasswordHash = await this.cryptService.generateHash(passwordRecoveryDto.newPassword)
    user.userData.passwordHash = newPasswordHash
    user.userConfirmationData.isPasswordRecoveryConfirmed = true

    await this.usersRepository.saveUser(user)

    return this.notice
  }

  validateUser(user?: User) {
    if (!user) {
      this.notice.addError('Incorrect verification code', 'recoveryCode', HttpStatusCodes.BAD_REQUEST_400)

      return
    }

    if (user.userConfirmationData.isPasswordRecoveryConfirmed) {
      this.notice.addError('Recovery was already confirmed', 'recoveryCode', HttpStatusCodes.BAD_REQUEST_400)
    }

    if (user.userConfirmationData.passwordRecoveryCodeExpirationDate < new Date()) {
      this.notice.addError('Recovery code expired', 'recoveryCode', HttpStatusCodes.BAD_REQUEST_400)
    }
  }
}

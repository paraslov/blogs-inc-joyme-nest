import { PasswordRecoveryDto } from '../../api/models/input/password-recovery.dto'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { InterlayerDataManager } from '../../../../common/manager'
import { HttpStatusCodes } from '../../../../common/models'
import { UserInfo, UsersRepository } from '../../../users'
import { CryptService } from '../../../../common/services'
import { AuthRepository } from '../../infrastructure/auth.repository'

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
    const userInfo = await this.authRepository.getUserInfoByRecoveryCode(passwordRecoveryDto.recoveryCode)

    const resultNotice = this.validateUser(userInfo)
    if (resultNotice.hasError()) {
      return resultNotice
    }

    const user = await this.usersRepository.getUserById(userInfo.user_id)
    user.password_hash = await this.cryptService.generateHash(passwordRecoveryDto.newPassword)
    userInfo.is_password_recovery_confirmed = true

    await this.usersRepository.updateUserAndInfo(user, userInfo)

    return resultNotice
  }

  validateUser(user?: UserInfo) {
    const notice = new InterlayerDataManager()

    if (!user) {
      notice.addError('Incorrect verification code', 'recoveryCode', HttpStatusCodes.BAD_REQUEST_400)

      return notice
    }
    if (user.is_password_recovery_confirmed) {
      notice.addError('Recovery was already confirmed', 'recoveryCode', HttpStatusCodes.BAD_REQUEST_400)
    }
    if (user.password_recovery_code_expiration_date < new Date()) {
      notice.addError('Recovery code expired', 'recoveryCode', HttpStatusCodes.BAD_REQUEST_400)
    }

    return notice
  }
}

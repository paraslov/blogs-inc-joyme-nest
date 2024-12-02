import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { EmailSendManager, InterlayerDataManager } from '../../../../common/manager'
import { v4 as uuidv4 } from 'uuid'
import { add } from 'date-fns'
import { HttpStatusCodes } from '../../../../common/models'
import { UsersSqlRepository } from '../../../users'
import { AuthRepository } from '../../infrastructure/auth.repository.service'

export class PasswordRecoveryCommand {
  constructor(public readonly email: string) {}
}

@CommandHandler(PasswordRecoveryCommand)
export class PasswordRecoveryHandler implements ICommandHandler<PasswordRecoveryCommand> {
  constructor(
    private readonly emailSendManager: EmailSendManager,
    private readonly authRepository: AuthRepository,
    private readonly usersRepository: UsersSqlRepository,
  ) {}

  async execute(command: PasswordRecoveryCommand) {
    const { email } = command
    const notice = new InterlayerDataManager()
    const userData = await this.authRepository.getUserByLoginOrEmail(email)

    if (!userData) {
      notice.addError('No user found', 'email', HttpStatusCodes.NOT_FOUND_404)
      return notice
    }

    const recoveryCode = uuidv4()
    userData.userInfo.password_recovery_code = recoveryCode
    userData.userInfo.password_recovery_code_expiration_date = add(new Date(), {
      hours: 1,
      minutes: 1,
    })
    userData.userInfo.is_password_recovery_confirmed = false

    try {
      const mailInfo = await this.emailSendManager.sendPasswordRecoveryEmail(email, recoveryCode)
      console.log('@> Information::mailInfo: ', mailInfo)
    } catch (err) {
      console.error('@> Error::emailManager: ', err)
      notice.addError('Cannot send email. Try again later', 'email', HttpStatusCodes.FAILED_DEPENDENCY_424)
    }

    await this.usersRepository.updateUserAndInfo(userData.user, userData.userInfo)

    return notice
  }
}

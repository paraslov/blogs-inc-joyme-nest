import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { EmailSendManager, InterlayerDataManager } from '../../../../common/manager'
import { AuthRepository } from '../../infrastructure/auth.repository'
import { v4 as uuidv4 } from 'uuid'
import { add } from 'date-fns'
import { HttpStatusCodes } from '../../../../common/models'
import { UsersRepository } from '../../../users'

export class PasswordRecoveryCommand {
  constructor(public readonly email: string) {}
}

@CommandHandler(PasswordRecoveryCommand)
export class PasswordRecoveryHandler implements ICommandHandler<PasswordRecoveryCommand> {
  constructor(
    private readonly emailSendManager: EmailSendManager,
    private readonly authRepository: AuthRepository,
    private readonly usersRepository: UsersRepository,
  ) {}

  async execute(command: PasswordRecoveryCommand) {
    const { email } = command
    const notice = new InterlayerDataManager()
    const user = await this.authRepository.getUserByLoginOrEmail(email)

    if (!user) {
      return notice
    }

    const recoveryCode = uuidv4()
    user.userConfirmationData.passwordRecoveryCode = recoveryCode
    user.userConfirmationData.passwordRecoveryCodeExpirationDate = add(new Date(), {
      hours: 1,
      minutes: 1,
    })
    user.userConfirmationData.isPasswordRecoveryConfirmed = false

    try {
      const mailInfo = await this.emailSendManager.sendPasswordRecoveryEmail(email, recoveryCode)
      console.log('@> Information::mailInfo: ', mailInfo)
    } catch (err) {
      console.error('@> Error::emailManager: ', err)
      notice.addError('Cannot send email. Try again later', 'email', HttpStatusCodes.FAILED_DEPENDENCY_424)
    }

    await this.usersRepository.saveUser(user)

    return notice
  }
}

import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { AuthRepository } from '../../infrastructure/auth.repository'
import { EmailSendManager, InterlayerDataManager } from '../../../../common/manager'
import { HttpStatusCodes } from '../../../../common/models'
import { v4 as uuidv4 } from 'uuid'
import { add } from 'date-fns'
import { UsersRepository } from '../../../users'

export class RegistrationEmailResendingCommand {
  constructor(public readonly email: string) {}
}

@CommandHandler(RegistrationEmailResendingCommand)
export class RegistrationEmailResendingHandler implements ICommandHandler<RegistrationEmailResendingCommand> {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly usersRepository: UsersRepository,
    private readonly emailSendManager: EmailSendManager,
  ) {}

  async execute(command: RegistrationEmailResendingCommand) {
    const { email } = command
    const notice = new InterlayerDataManager()

    const user = await this.authRepository.getUserByLoginOrEmail(email)

    if (!user) {
      notice.addError(`No user registrations with email: ${email}`, 'email', HttpStatusCodes.BAD_REQUEST_400)

      return notice
    }
    if (user.userConfirmationData.isConfirmed) {
      notice.addError(`Registration was already confirmed`, 'email', HttpStatusCodes.BAD_REQUEST_400)

      return notice
    }

    const confirmationCode = uuidv4()
    user.userConfirmationData.confirmationCode = confirmationCode
    user.userConfirmationData.confirmationCodeExpirationDate = add(new Date(), {
      hours: 1,
      minutes: 1,
    })

    await this.usersRepository.saveUser(user)

    try {
      const mailInfo = await this.emailSendManager.resendRegistrationEmail(email, confirmationCode)
      console.log('@> Information::mailInfo: ', mailInfo)
    } catch (err) {
      console.error('@> Error::emailManager: ', err)
    }

    return notice
  }
}

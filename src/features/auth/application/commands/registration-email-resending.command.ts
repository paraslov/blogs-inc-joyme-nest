import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { EmailSendManager, InterlayerDataManager } from '../../../../common/manager'
import { HttpStatusCodes } from '../../../../common/models'
import { v4 as uuidv4 } from 'uuid'
import { add } from 'date-fns'
import { UserInfoEntity, UsersRepository } from '../../../users'
import { AuthRepository } from '../../infrastructure/auth.repository'

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
    const userData = await this.authRepository.getUserByLoginOrEmail(email)

    const resultNotice = this.checkUser(email, userData?.userInfo)
    if (resultNotice.hasError() || !userData) {
      return resultNotice
    }

    const confirmationCode = uuidv4()
    userData.userInfo.confirmation_code = confirmationCode
    userData.userInfo.confirmation_code_expiration_date = add(new Date(), {
      hours: 1,
      minutes: 1,
    })

    await this.usersRepository.updateUserAndInfo(userData.user, userData.userInfo)

    try {
      const mailInfo = await this.emailSendManager.resendRegistrationEmail(email, confirmationCode)
    } catch (err) {
      console.error('Error::emailManager: ', err)
    }

    return resultNotice
  }

  checkUser(email: string, user: UserInfoEntity | null) {
    const notice = new InterlayerDataManager()

    if (!user) {
      notice.addError(`No user registrations with email: ${email}`, 'email', HttpStatusCodes.BAD_REQUEST_400)

      return notice
    }
    if (user.is_confirmed) {
      notice.addError(`Registration was already confirmed`, 'email', HttpStatusCodes.BAD_REQUEST_400)

      return notice
    }

    return notice
  }
}

import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { CreateUserDto, User, UsersRepository } from '../../../users'
import { CryptService } from '../../../../common/services'
import { v4 as uuidv4 } from 'uuid'
import { add } from 'date-fns'
import { EmailSendManager, InterlayerDataManager } from '../../../../common/manager'
import { HttpStatusCodes } from '../../../../common/models'
import { AuthRepository } from '../../infrastructure/auth.repository'

export class RegisterUserCommand {
  constructor(public readonly createUserDto: CreateUserDto) {}
}

@CommandHandler(RegisterUserCommand)
export class RegisterUserHandler implements ICommandHandler<RegisterUserCommand> {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly usersRepository: UsersRepository,
    private readonly cryptService: CryptService,
    private readonly emailSendManager: EmailSendManager,
  ) {}

  async execute(command: RegisterUserCommand) {
    const { createUserDto } = command
    const { login, email, password } = createUserDto

    const resultNotice = await this.isUserUnique(login, email)
    if (resultNotice.hasError()) {
      return resultNotice
    }

    const passwordHash = await this.cryptService.generateHash(password)
    const confirmationCode = uuidv4()

    const userToRegister: User = {
      userData: {
        login,
        email,
        passwordHash,
        createdAt: new Date().toISOString(),
      },
      userConfirmationData: {
        confirmationCode,
        confirmationCodeExpirationDate: add(new Date(), {
          hours: 1,
          minutes: 1,
        }),
        isConfirmed: false,
      },
    }

    await this.usersRepository.createUser(userToRegister)

    try {
      const mailInfo = this.emailSendManager.sendRegistrationEmail(email, confirmationCode)
      console.log('@> Information::mailInfo: ', mailInfo)
    } catch (err) {
      console.error('@> Error::emailManager: ', err)
    }

    return resultNotice
  }
  async isUserUnique(login: string, email: string) {
    const notice = new InterlayerDataManager()

    const userByLogin = await this.authRepository.getUserByLoginOrEmail(login)
    if (userByLogin) {
      notice.addError('This login is already used', 'login', HttpStatusCodes.BAD_REQUEST_400)
    }

    const userByEmail = await this.authRepository.getUserByLoginOrEmail(email)
    if (userByEmail) {
      notice.addError('This email is already used', 'email', HttpStatusCodes.BAD_REQUEST_400)
    }

    return notice
  }
}

import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { CreateUserDto, User } from '../../../users'
import { CryptService } from '../../../../common/services'
import { v4 as uuidv4 } from 'uuid'
import { add } from 'date-fns'
import { UsersRepository } from '../../../users'
import { EmailSendManager, InterlayerDataManager } from '../../../../common/manager'
import { AuthRepository } from '../../infrastructure/auth.repository'
import { HttpStatusCodes } from '../../../../common/models'

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
  notice = new InterlayerDataManager()

  async execute(command: RegisterUserCommand) {
    const { createUserDto } = command
    const { login, email, password } = createUserDto

    await this.isUserUnique(login, email)
    if (this.notice.hasError()) {
      return this.notice
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

    await this.usersRepository.saveUser(userToRegister)

    try {
      const mailInfo = await this.emailSendManager.sendRegistrationEmail(email, confirmationCode)
      console.log('@> Information::mailInfo: ', mailInfo)
    } catch (err) {
      console.error('@> Error::emailManager: ', err)
    }

    return this.notice
  }
  async isUserUnique(login: string, email: string) {
    const userByLogin = await this.authRepository.getUserByLoginOrEmail(login)
    if (userByLogin) {
      this.notice.addError('This login is already used', 'login', HttpStatusCodes.BAD_REQUEST_400)
    }

    const userByEmail = await this.authRepository.getUserByLoginOrEmail(email)
    if (userByEmail) {
      this.notice.addError('This email is already used', 'email', HttpStatusCodes.BAD_REQUEST_400)
    }
  }
}

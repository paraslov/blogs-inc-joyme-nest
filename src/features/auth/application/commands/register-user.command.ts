import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { CreateUserDto, User } from '../../../users'
import { CryptService } from '../../../../common/services'
import { v4 as uuidv4 } from 'uuid'
import { add } from 'date-fns'
import { UsersRepository } from '../../../users/infrastructure/users.repository'
import { EmailSendManager } from '../../../../common/manager/email-send.manager'

export class RegisterUserCommand {
  constructor(public readonly createUserDto: CreateUserDto) {}
}

@CommandHandler(RegisterUserCommand)
export class RegisterUserHandler implements ICommandHandler<RegisterUserCommand> {
  constructor(
    private readonly cryptService: CryptService,
    private readonly usersRepository: UsersRepository,
    private readonly emailSendManager: EmailSendManager,
  ) {}

  async execute(command: RegisterUserCommand) {
    const { createUserDto } = command
    const { login, email, password } = createUserDto
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

    return true
  }
}

import { CreateUserDto } from '../../api/models/input/create-user.dto'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { User } from '../../domain/mongoose/users.entity'
import { CryptService } from '../../../../common/services'
import { UsersRepository } from '../../infrastructure/users.repository'

export class CreateUserCommand {
  constructor(public readonly createUserDto: CreateUserDto) {}
}

@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
  constructor(
    private cryptService: CryptService,
    private usersRepository: UsersRepository,
  ) {}

  async execute(command: CreateUserCommand) {
    const { createUserDto } = command
    const passwordHash = await this.cryptService.generateHash(createUserDto.password)

    const newUser: User = {
      userData: {
        login: createUserDto.login,
        email: createUserDto.email,
        passwordHash: passwordHash,
        createdAt: new Date().toISOString(),
      },
      userConfirmationData: {
        confirmationCode: 'default_code',
        confirmationCodeExpirationDate: new Date(),
        isConfirmed: true,
      },
    }

    return this.usersRepository.saveUser(newUser)
  }
}

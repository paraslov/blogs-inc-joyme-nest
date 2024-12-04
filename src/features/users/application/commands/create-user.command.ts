import { CreateUserDto } from '../../api/models/input/create-user.dto'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { User } from '../../domain/business_entity/users.entity'
import { CryptService } from '../../../../common/services'
import { UsersRepository } from '../../infrastructure/users.repository.service'
import { UsersQueryRepository } from '../../infrastructure/users.query-repository'

export class CreateUserCommand {
  constructor(public readonly createUserDto: CreateUserDto) {}
}

@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
  constructor(
    private cryptService: CryptService,
    private usersRepository: UsersRepository,
    private usersQueryRepository: UsersQueryRepository,
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
        confirmationCode: '44444444-4444-4444-4444-444444444444',
        confirmationCodeExpirationDate: new Date(),
        isConfirmed: true,
      },
    }

    const createdUserId = await this.usersRepository.createUser(newUser)

    return this.usersQueryRepository.getUser(createdUserId)
  }
}

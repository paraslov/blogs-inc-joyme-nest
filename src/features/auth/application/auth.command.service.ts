import { Injectable } from '@nestjs/common'
import { RegisterUserCommand } from './commands/register-user.command'
import { CommandBus } from '@nestjs/cqrs'
import { CreateUserDto } from '../../users'
import { ConfirmUserCommand } from './commands/confirm-user.command'
import { InterlayerDataManager } from '../../../common/manager'
import { RegistrationEmailResendingCommand } from './commands/registration-email-resending.command'
import { PasswordRecoveryCommand } from './commands/password-recovery.command'
import { PasswordRecoveryDto } from '../api/models/input/password-recovery.dto'
import { ConfirmNewPasswordCommand } from './commands/confirm-new-password.command'
import { AuthStrategiesDto } from '../api/models/utility/auth-strategies-dto'
import { LoginCommand } from './commands/login.command'
import { RefreshTokenPairCommand } from './commands/refresh-token-pair.command'
import { TokensPair } from '../api/models/utility/token-pair.dto'

@Injectable()
export class AuthCommandService {
  constructor(private commandBus: CommandBus) {}

  registerUser(createUserDto: CreateUserDto) {
    const command = new RegisterUserCommand(createUserDto)

    return this.commandBus.execute<RegisterUserCommand, InterlayerDataManager>(command)
  }

  confirmUser(confirmationCode: string) {
    const command = new ConfirmUserCommand(confirmationCode)

    return this.commandBus.execute<ConfirmUserCommand, InterlayerDataManager>(command)
  }

  registrationEmailResending(email: string) {
    const command = new RegistrationEmailResendingCommand(email)

    return this.commandBus.execute<RegistrationEmailResendingCommand, InterlayerDataManager>(command)
  }

  passwordRecovery(email: string) {
    const command = new PasswordRecoveryCommand(email)

    return this.commandBus.execute<PasswordRecoveryCommand, InterlayerDataManager>(command)
  }

  confirmNewPassword(passwordRecoveryDto: PasswordRecoveryDto) {
    const command = new ConfirmNewPasswordCommand(passwordRecoveryDto)

    return this.commandBus.execute<ConfirmNewPasswordCommand, InterlayerDataManager>(command)
  }

  loginUser(authData: AuthStrategiesDto, deviceName: string, ip: string) {
    const command = new LoginCommand(authData, deviceName, ip)

    return this.commandBus.execute<LoginCommand, InterlayerDataManager<TokensPair>>(command)
  }

  refreshTokenPair(refreshToken: string) {
    const command = new RefreshTokenPairCommand(refreshToken)

    return this.commandBus.execute<RefreshTokenPairCommand, InterlayerDataManager<TokensPair>>(command)
  }
}

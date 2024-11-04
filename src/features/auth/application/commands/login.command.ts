import { AuthStrategiesDto } from '../../api/models/utility/auth-strategies-dto'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { AuthService } from '../auth.service'
import { InterlayerDataManager } from '../../../../common/manager'
import { DevicesCommandService } from '../../../devices'

export type TokensPair = {
  accessToken: string
  refreshToken: string
}

export class LoginCommand {
  constructor(public authData: AuthStrategiesDto) {}
}

@CommandHandler(LoginCommand)
export class LoginCommandHandler implements ICommandHandler<LoginCommand> {
  constructor(
    private authService: AuthService,
    private deviceCommandService: DevicesCommandService,
  ) {}

  async execute(command: LoginCommand) {
    const { authData } = command
    const notice = new InterlayerDataManager<TokensPair>()
    const tokens = await this.authService.getTokens(authData)

    notice.addData(tokens)

    return notice
  }
}

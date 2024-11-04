import { AuthStrategiesDto } from '../../api/models/utility/auth-strategies-dto'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { AuthService } from '../auth.service'
import { InterlayerDataManager } from '../../../../common/manager'
import { DevicesCommandService } from '../../../devices'
import { v4 as uuidv4 } from 'uuid'
import { HttpStatusCodes } from '../../../../common/models'

export type TokensPair = {
  accessToken: string
  refreshToken: string
}

export class LoginCommand {
  constructor(
    public authData: AuthStrategiesDto,
    public deviceName: string,
    public ip: string,
  ) {}
}

@CommandHandler(LoginCommand)
export class LoginCommandHandler implements ICommandHandler<LoginCommand> {
  constructor(
    private authService: AuthService,
    private deviceCommandService: DevicesCommandService,
  ) {}

  async execute(command: LoginCommand) {
    const { authData, deviceName, ip } = command
    const notice = new InterlayerDataManager<TokensPair>()

    const deviceId = uuidv4()
    const tokens = await this.authService.getTokens(authData, deviceId)
    if (!tokens?.refreshToken || !tokens?.accessToken) {
      notice.addError('Could not create tokens', null, HttpStatusCodes.EXPECTATION_FAILED_417)

      return notice
    }

    const createSessionNotice = await this.deviceCommandService.createDeviceSession({
      ip,
      deviceName,
      userId: authData.sub,
      refreshToken: tokens.refreshToken,
    })

    if (createSessionNotice.hasError()) {
      return createSessionNotice
    }

    notice.addData(tokens)

    return notice
  }
}

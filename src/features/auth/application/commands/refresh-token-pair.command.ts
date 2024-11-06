import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { AuthService } from '../auth.service'
import { DevicesCommandService } from '../../../devices'
import { JwtOperationsService } from '../../../../common/services'
import { InterlayerDataManager } from '../../../../common/manager'

export class RefreshTokenPairCommand {
  constructor(public readonly refreshToken: string) {}
}

@CommandHandler(RefreshTokenPairCommand)
export class RefreshTokenPairCommandHandler implements ICommandHandler<RefreshTokenPairCommand> {
  constructor(
    private authService: AuthService,
    private devicesCommandService: DevicesCommandService,
    private jwtOperationsService: JwtOperationsService,
  ) {}

  async execute({ refreshToken }) {
    const notice = new InterlayerDataManager<{ accessToken: string; refreshToken: string }>()
    const decodedData = this.jwtOperationsService.decodeRefreshToken(refreshToken)
    const newTokenPair = await this.authService.getTokens(
      { username: decodedData.username, sub: decodedData.sub },
      decodedData.deviceId,
    )
    const newRefreshTokenData = this.jwtOperationsService.decodeRefreshToken(newTokenPair.refreshToken)

    const updateResultNotice = await this.devicesCommandService.updateDeviceSession(
      decodedData.deviceId,
      newRefreshTokenData.iat,
    )

    if (!newTokenPair.refreshToken || !newTokenPair.accessToken || updateResultNotice.hasError()) {
      notice.extensions = updateResultNotice.extensions

      return notice
    }

    notice.addData(newTokenPair)
    return notice
  }
}

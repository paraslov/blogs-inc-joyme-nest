import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { InterlayerDataManager } from '../../../../common/manager'
import { HttpStatusCodes } from '../../../../common/models'
import { DevicesQueryRepository } from '../../infrastructure/devices.query-repository'
import { JwtOperationsService } from '../../../../common/services'
import { DevicesSqlRepository } from '../../infrastructure/devices.sql-repository'

export class DeleteOtherDevicesCommand {
  constructor(public readonly refreshToken: string) {}
}

@CommandHandler(DeleteOtherDevicesCommand)
export class DeleteOtherDevicesCommandHandler implements ICommandHandler<DeleteOtherDevicesCommand> {
  constructor(
    private devicesQueryRepository: DevicesQueryRepository,
    private devicesRepository: DevicesSqlRepository,
    private jwtOperationsService: JwtOperationsService,
  ) {}

  async execute({ refreshToken }) {
    const notice = new InterlayerDataManager()

    const decodedData = this.jwtOperationsService.decodeRefreshToken(refreshToken)
    if (!decodedData?.deviceId) {
      notice.addError('No refresh token data', 'refreshToken', HttpStatusCodes.BAD_REQUEST_400)

      return notice
    }

    const userDevices = await this.devicesQueryRepository.getAllDevices(decodedData.sub)
    const devicesToDelete = userDevices
      .filter((device) => device.deviceId !== decodedData.deviceId)
      .map((dev) => dev.deviceId)

    await this.devicesRepository.deleteOtherDevices(devicesToDelete)

    return notice
  }
}

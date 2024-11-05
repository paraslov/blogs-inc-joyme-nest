import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { InterlayerDataManager } from '../../../../common/manager'
import { DevicesService } from '../devices.service'
import { DevicesRepository } from '../../infrastructure/devices.repository'
import { HttpStatusCodes } from '../../../../common/models'

export class DeleteDeviceCommand {
  constructor(public readonly refreshToken: string) {}
}

@CommandHandler(DeleteDeviceCommand)
export class DeleteDeviceCommandHandler implements ICommandHandler<DeleteDeviceCommand> {
  constructor(
    private deviceService: DevicesService,
    private devicesRepository: DevicesRepository,
  ) {}

  async execute({ refreshToken }) {
    const notice = new InterlayerDataManager()

    const decodedData = this.deviceService.decodeRefreshToken(refreshToken)
    if (!decodedData?.deviceId) {
      notice.addError('No refresh token data', 'refreshToken', HttpStatusCodes.BAD_REQUEST_400)

      return notice
    }

    const deleteResult = await this.devicesRepository.deleteDeviceByDeviceId(decodedData.deviceId)
    if (!deleteResult) {
      notice.addError('Device id not found', 'refreshToken', HttpStatusCodes.BAD_REQUEST_400)
    }

    return notice
  }
}

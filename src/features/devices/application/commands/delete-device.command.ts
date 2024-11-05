import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { InterlayerDataManager } from '../../../../common/manager'
import { DevicesService } from '../devices.service'
import { DevicesRepository } from '../../infrastructure/devices.repository'
import { HttpStatusCodes } from '../../../../common/models'

export class DeleteDeviceCommand {
  constructor(
    public readonly refreshToken: string,
    public readonly deviceId: string,
  ) {}
}

@CommandHandler(DeleteDeviceCommand)
export class DeleteDeviceCommandHandler implements ICommandHandler<DeleteDeviceCommand> {
  constructor(
    private deviceService: DevicesService,
    private devicesRepository: DevicesRepository,
  ) {}

  async execute({ refreshToken, deviceId }) {
    const notice = await this.deleteDeviceValidations(refreshToken, deviceId)

    const deleteResult = await this.devicesRepository.deleteDeviceByDeviceId(deviceId)
    if (!deleteResult) {
      notice.addError('Device id not found', 'refreshToken', HttpStatusCodes.BAD_REQUEST_400)
    }

    return notice
  }

  async deleteDeviceValidations(refreshToken: string, deviceId: string) {
    const notice = new InterlayerDataManager()

    const decodedData = this.deviceService.decodeRefreshToken(refreshToken)
    if (!decodedData?.deviceId) {
      notice.addError('No refresh token data', 'refreshToken', HttpStatusCodes.BAD_REQUEST_400)

      return notice
    }

    const device = await this.devicesRepository.getDeviceById(deviceId)
    if (!device) {
      notice.addError('Device not found', 'deviceId', HttpStatusCodes.NOT_FOUND_404)

      return notice
    }

    if (device.userId !== decodedData.sub) {
      notice.addError('You are trying to delete device of another user', 'deviceId', HttpStatusCodes.FORBIDDEN_403)

      return notice
    }

    return notice
  }
}

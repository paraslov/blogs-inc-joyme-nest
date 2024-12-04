import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { InterlayerDataManager } from '../../../../common/manager'
import { HttpStatusCodes } from '../../../../common/models'
import { JwtOperationsService } from '../../../../common/services'
import { DevicesRepository } from '../../infrastructure/devices.repository'

export class DeleteDeviceCommand {
  constructor(
    public readonly refreshToken: string,
    public readonly deviceId?: string,
  ) {}
}

@CommandHandler(DeleteDeviceCommand)
export class DeleteDeviceCommandHandler implements ICommandHandler<DeleteDeviceCommand> {
  constructor(
    private jwtOperationsService: JwtOperationsService,
    private devicesRepository: DevicesRepository,
  ) {}

  async execute({ refreshToken, deviceId }: DeleteDeviceCommand) {
    const notice = await this.deleteDeviceValidations(refreshToken, deviceId)
    if (notice.hasError()) {
      return notice
    }
    const deviceIdToDelete = notice.data.deviceIdToDelete

    const deleteResult = await this.devicesRepository.deleteDeviceByDeviceId(deviceIdToDelete)
    if (!deleteResult) {
      notice.addError('Device id not found', 'refreshToken', HttpStatusCodes.BAD_REQUEST_400)
    }

    return notice
  }

  async deleteDeviceValidations(refreshToken: string, deviceId?: string) {
    const notice = new InterlayerDataManager<{ deviceIdToDelete: string }>()

    const decodedData = this.jwtOperationsService.decodeRefreshToken(refreshToken)
    if (!decodedData?.deviceId) {
      notice.addError('No refresh token data', 'refreshToken', HttpStatusCodes.BAD_REQUEST_400)

      return notice
    }

    const deviceIdToDelete = deviceId ?? decodedData.deviceId

    const device = await this.devicesRepository.getDeviceById(deviceIdToDelete)
    if (!device) {
      notice.addError('Device not found', 'deviceId', HttpStatusCodes.NOT_FOUND_404)

      return notice
    }

    if (device.user_id !== decodedData.sub) {
      notice.addError('You are trying to delete device of another user', 'deviceId', HttpStatusCodes.FORBIDDEN_403)

      return notice
    }

    notice.addData({ deviceIdToDelete })
    return notice
  }
}

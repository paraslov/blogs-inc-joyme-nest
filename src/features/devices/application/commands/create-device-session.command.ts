import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { DevicesService } from '../devices.service'
import { Device } from '../../domain/mongoose/device.entity'
import { DevicesRepository } from '../../infrastructure/devices.repository'
import { InterlayerDataManager } from '../../../../common/manager'
import { HttpStatusCodes } from '../../../../common/models'
import { CreateDeviceSessionDto } from '../../api/models/input/create-device-session.dto'

export class CreateDeviceSessionCommand {
  constructor(public readonly payload: CreateDeviceSessionDto) {}
}

@CommandHandler(CreateDeviceSessionCommand)
export class CreateDeviceSessionCommandHandler implements ICommandHandler<CreateDeviceSessionCommand> {
  constructor(
    private deviceService: DevicesService,
    private devicesRepository: DevicesRepository,
  ) {}

  async execute({ payload }: CreateDeviceSessionCommand) {
    const { userId, refreshToken, ip, deviceName } = payload

    const { decodedData, notice } = await this.checkTokenData(refreshToken)
    if (notice.hasError()) {
      return notice
    }

    const newDeviceSession: Device = {
      ip,
      deviceName,
      userId,
      deviceId: decodedData.deviceId,
      iat: decodedData.iat,
      exp: decodedData.exp,
    }

    const saveResult = await this.devicesRepository.saveDeviceSession(newDeviceSession)
    if (!saveResult) {
      notice.addError('Failed to create device session', null, HttpStatusCodes.EXPECTATION_FAILED_417)
    }

    return notice
  }

  async checkTokenData(refreshToken: string) {
    const notice = new InterlayerDataManager()
    const decodedData = this.deviceService.decodeRefreshToken(refreshToken)

    if (!decodedData?.deviceId) {
      notice.addError('No refresh token data', 'refreshToken', HttpStatusCodes.BAD_REQUEST_400)

      return { decodedData, notice }
    }

    const hasCurrentDevice = await this.devicesRepository.getDeviceById(decodedData.deviceId)
    if (hasCurrentDevice) {
      notice.addError('Already has device session', 'refreshToken', HttpStatusCodes.BAD_REQUEST_400)

      return { decodedData, notice }
    }

    return { decodedData, notice }
  }
}

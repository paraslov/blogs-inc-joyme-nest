import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { DeviceEntity } from '../../domain/business_entity/device.entity'
import { InterlayerDataManager } from '../../../../common/manager'
import { HttpStatusCodes } from '../../../../common/models'
import { CreateDeviceSessionDto } from '../../api/models/input/create-device-session.dto'
import { JwtOperationsService } from '../../../../common/services'
import { DevicesRepository } from '../../infrastructure/devices.repository'

export class CreateDeviceSessionCommand {
  constructor(public readonly payload: CreateDeviceSessionDto) {}
}

@CommandHandler(CreateDeviceSessionCommand)
export class CreateDeviceSessionCommandHandler implements ICommandHandler<CreateDeviceSessionCommand> {
  constructor(
    private jwtOperationsService: JwtOperationsService,
    private devicesRepository: DevicesRepository,
  ) {}

  async execute({ payload }: CreateDeviceSessionCommand) {
    const { userId, refreshToken, ip, deviceName } = payload

    const { decodedData, notice } = await this.checkTokenData(refreshToken)
    if (notice.hasError()) {
      return notice
    }

    const newDeviceSession: DeviceEntity = {
      ip,
      deviceName,
      userId,
      deviceId: decodedData.deviceId,
      iat: decodedData.iat,
      exp: decodedData.exp,
    }

    const saveResult = await this.devicesRepository.createDeviceSession(newDeviceSession)
    if (!saveResult) {
      notice.addError('Failed to create device session', null, HttpStatusCodes.EXPECTATION_FAILED_417)
    }

    return notice
  }

  async checkTokenData(refreshToken: string) {
    const notice = new InterlayerDataManager()
    const decodedData = this.jwtOperationsService.decodeRefreshToken(refreshToken)

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

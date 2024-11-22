import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { InterlayerDataManager } from '../../../../common/manager'
import { HttpStatusCodes } from '../../../../common/models'
import { DevicesSqlRepository } from '../../infrastructure/devices.sql-repository'

export class UpdateDeviceSessionCommand {
  constructor(
    public readonly deviceId: string,
    public readonly iat: number,
  ) {}
}

@CommandHandler(UpdateDeviceSessionCommand)
export class UpdateDeviceSessionCommandHandler implements ICommandHandler<UpdateDeviceSessionCommand> {
  constructor(private devicesRepository: DevicesSqlRepository) {}

  async execute({ deviceId, iat }: UpdateDeviceSessionCommand) {
    const notice = new InterlayerDataManager()

    const deviceSession = await this.devicesRepository.getDeviceById(deviceId)
    if (!deviceSession) {
      notice.addError('No device session', 'refreshToken', HttpStatusCodes.UNAUTHORIZED_401)

      return notice
    }

    deviceSession.iat = iat
    await this.devicesRepository.updateDeviceSession(deviceSession)

    return notice
  }
}

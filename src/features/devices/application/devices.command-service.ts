import { Injectable } from '@nestjs/common'
import { CommandBus } from '@nestjs/cqrs'
import { DeleteOtherDevicesCommand } from './commands/delete-other-devices.command'
import { InterlayerDataManager } from '../../../common/manager'
import { CreateDeviceSessionCommand } from './commands/create-device-session.command'
import { CreateDeviceSessionDto } from '../api/models/input/create-device-session.dto'
import { DeleteDeviceCommand } from './commands/delete-device.command'

@Injectable()
export class DevicesCommandService {
  constructor(private commandBus: CommandBus) {}

  deleteOtherDevices(refreshToken: string) {
    const command = new DeleteOtherDevicesCommand(refreshToken)

    return this.commandBus.execute<DeleteOtherDevicesCommand, InterlayerDataManager>(command)
  }
  createDeviceSession(payload: CreateDeviceSessionDto) {
    const command = new CreateDeviceSessionCommand(payload)

    return this.commandBus.execute<CreateDeviceSessionCommand, InterlayerDataManager>(command)
  }
  deleteDevice(refreshToken: string, deviceId: string) {
    const command = new DeleteDeviceCommand(refreshToken, deviceId)

    return this.commandBus.execute<DeleteDeviceCommand, InterlayerDataManager>(command)
  }
}

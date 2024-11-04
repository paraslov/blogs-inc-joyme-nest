import { Injectable } from '@nestjs/common'
import { CommandBus } from '@nestjs/cqrs'
import { DeleteOtherDevicesCommand } from './commands/delete-other-devices.command'
import { InterlayerDataManager } from '../../../common/manager'

@Injectable()
export class DevicesCommandService {
  constructor(private commandBus: CommandBus) {}

  deleteOtherDevices(refreshToken: string) {
    const command = new DeleteOtherDevicesCommand(refreshToken)

    return this.commandBus.execute<DeleteOtherDevicesCommand, InterlayerDataManager>(command)
  }
}

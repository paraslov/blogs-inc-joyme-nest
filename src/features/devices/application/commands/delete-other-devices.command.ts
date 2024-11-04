import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { DevicesRepository } from '../../infrastructure/devices.repository'
import { InterlayerDataManager } from '../../../../common/manager'
import { JwtService } from '@nestjs/jwt'
import { DevicesService } from '../devices.service'

export class DeleteOtherDevicesCommand {
  constructor(public readonly refreshToken: string) {}
}

@CommandHandler(DeleteOtherDevicesCommand)
export class DeleteOtherDevicesCommandHandler implements ICommandHandler<DeleteOtherDevicesCommand> {
  constructor(
    private devicesRepository: DevicesRepository,
    private deviceService: DevicesService,
    private jwtService: JwtService,
  ) {}

  async execute({ refreshToken }) {
    const notice = new InterlayerDataManager()

    const decodedData = this.deviceService.decodeRefreshToken(refreshToken)
    console.log('@> decoded data', decodedData)
  }
}

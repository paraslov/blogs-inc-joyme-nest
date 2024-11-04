import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { DevicesRepository } from '../../infrastructure/devices.repository'
import { InterlayerDataManager } from '../../../../common/manager'
import { JwtService } from '@nestjs/jwt'

export class DeleteOtherDevicesCommand {
  constructor(public readonly refreshToken: string) {}
}

@CommandHandler(DeleteOtherDevicesCommand)
export class DeleteOtherDevicesCommandHandler implements ICommandHandler<DeleteOtherDevicesCommand> {
  constructor(
    private readonly devicesRepository: DevicesRepository,
    private jwtService: JwtService,
  ) {}

  async execute({ refreshToken }) {
    const notice = new InterlayerDataManager()

    const decodedData = this.decodeRefreshToken(refreshToken)
    console.log('@> decoded data', decodedData)
  }

  decodeRefreshToken(refreshToken: string) {
    try {
      const decoded = this.jwtService.decode(refreshToken)

      return decoded
    } catch (error) {
      console.error('Error decoding token:', error)
      return null
    }
  }
}

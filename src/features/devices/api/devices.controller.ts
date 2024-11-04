import { Controller, Get, Request, Response, UseGuards } from '@nestjs/common'
import { RefreshTokenGuard } from '../../auth/application/guards/refresh-auth.guard'
import { AuthRequestDto } from '../../auth'
import { HttpStatusCodes } from '../../../common/models'
import { DevicesQueryRepository } from '../infrastructure/devices.query-repository'
import { DevicesCommandService } from '../application/devices.command-service'

@Controller('security/devices')
export class DevicesController {
  constructor(
    private devicesQueryRepository: DevicesQueryRepository,
    private devicesCommandService: DevicesCommandService,
  ) {}

  @UseGuards(RefreshTokenGuard)
  @Get()
  async getDevices(@Request() req: { user: AuthRequestDto }, @Response() res: any) {
    const userId = req.user.userId

    const devices = await this.devicesQueryRepository.getAllDevices(userId)

    return res.status(HttpStatusCodes.OK_200).send(devices)
  }

  @UseGuards(RefreshTokenGuard)
  @Get()
  async deleteDevices(@Request() req: { user: AuthRequestDto }, @Response() res: any) {
    const refreshToken = req.user.refreshToken

    const device = await this.devicesCommandService.deleteOtherDevices(refreshToken)

    return res.status(HttpStatusCodes.OK_200).send(device)
  }
}

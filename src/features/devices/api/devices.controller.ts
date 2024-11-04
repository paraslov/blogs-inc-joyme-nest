import { Controller, Get, Request, Response, UseGuards } from '@nestjs/common'
import { RefreshTokenGuard } from '../../auth/application/guards/refresh-auth.guard'
import { AuthRequestDto } from '../../auth'
import { HttpStatusCodes } from '../../../common/models'
import { DevicesQueryRepository } from '../infrastructure/devices.query-repository'

@Controller('security/devices')
export class DevicesController {
  constructor(private devicesQueryRepository: DevicesQueryRepository) {
  }
  @UseGuards(RefreshTokenGuard)
  @Get()
  async getDevices(@Request() req: { user: AuthRequestDto }, @Response() res: any) {
    const userId = req.user.userId

    const devices = await this.devicesQueryRepository.getAllDevices(userId)

    return res.status(HttpStatusCodes.OK_200).send(devices)
  }
}

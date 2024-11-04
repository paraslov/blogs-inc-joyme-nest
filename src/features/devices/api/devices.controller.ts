import { Controller, Delete, Get, HttpException, Request, Response, UseGuards } from '@nestjs/common'
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
  @Delete()
  async deleteDevices(@Request() req: { user: AuthRequestDto }, @Response() res: any) {
    const refreshToken = req.user.refreshToken

    const deleteResult = await this.devicesCommandService.deleteOtherDevices(refreshToken)
    if (deleteResult.hasError()) {
      throw new HttpException(deleteResult.extensions, deleteResult.code)
    }

    return res.status(HttpStatusCodes.NO_CONTENT_204)
  }
}

import { Controller, Delete, Get, HttpException, Param, Req, Res, UseGuards } from '@nestjs/common'
import { Response } from 'express'
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
  async getDevices(@Req() req: { user: AuthRequestDto }, @Res() res: any) {
    const userId = req.user.userId

    const devices = await this.devicesQueryRepository.getAllDevices(userId)

    return res.status(HttpStatusCodes.OK_200).send(devices)
  }

  @UseGuards(RefreshTokenGuard)
  @Delete()
  async deleteDevices(@Req() req: { user: AuthRequestDto }, @Res() res: any) {
    const refreshToken = req.user.refreshToken

    const deleteResult = await this.devicesCommandService.deleteOtherDevices(refreshToken)
    if (deleteResult.hasError()) {
      throw new HttpException(deleteResult.extensions, deleteResult.code)
    }

    return res.status(HttpStatusCodes.NO_CONTENT_204).send()
  }

  @UseGuards(RefreshTokenGuard)
  @Delete(':deviceId')
  async deleteDevice(
    @Param('deviceId') deviceId: string,
    @Req() req: Response & { user: AuthRequestDto },
    @Res() res: any,
  ) {
    const refreshToken = req.user.refreshToken

    const deleteResult = await this.devicesCommandService.deleteDevice(refreshToken, deviceId)
    if (deleteResult.hasError()) {
      throw new HttpException(deleteResult.extensions, deleteResult.code)
    }

    return res.status(HttpStatusCodes.NO_CONTENT_204).send()
  }
}

import { Controller, Delete, Get, HttpCode } from '@nestjs/common'
import { AppService } from './app.service'
import { HttpStatusCodes } from './common/models'

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello() {
    return this.appService.getHello()
  }

  @Get('version')
  getVersion() {
    return this.appService.getVersion()
  }

  @HttpCode(HttpStatusCodes.NO_CONTENT_204)
  @Delete('testing/all-data')
  async deleteAllData() {
    await this.appService.deleteAllData()
  }
}

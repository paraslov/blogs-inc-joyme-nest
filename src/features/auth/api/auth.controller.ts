import { Controller, Get, UseGuards } from '@nestjs/common'
import { LocalAuthGuard } from '../../../base/guards/LocalAuth.guard'

@Controller('auth')
export class AuthController {
  @UseGuards(LocalAuthGuard)
  @Get()
  meData() {
    return 'bolt'
  }
}

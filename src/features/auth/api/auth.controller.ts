import { Controller, Get, UseGuards, Request, Post } from '@nestjs/common'
import { LocalAuthGuard } from '../application/guards/local-auth.guard'
import { AuthService } from '../application/auth.service'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Get()
  meData() {
    return 'bolt'
  }

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  login(@Request() req) {
    console.log('@> req.user: ', req.user)
    return this.authService.login(req.user)
  }
}

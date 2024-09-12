import { Controller, Get, UseGuards, Request, Post } from '@nestjs/common'
import { LocalAuthGuard } from '../application/guards/local-auth.guard'
import { AuthService } from '../application/auth.service'
import { JwtAuthGuard } from '../application/guards/jwt-auth.guard'
import { CurrentUserId } from '../../../base/decorators/current-user-id.decorator'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  meData(@CurrentUserId() currentUserId: string) {
    return currentUserId
  }

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  login(@Request() req: any) {
    return this.authService.login(req.user)
  }
}

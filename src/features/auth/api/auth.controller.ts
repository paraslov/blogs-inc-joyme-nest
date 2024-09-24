import { Controller, Get, UseGuards, Request, Post, Body } from '@nestjs/common'
import { LocalAuthGuard } from '../application/guards/local-auth.guard'
import { AuthService } from '../application/auth.service'
import { JwtAuthGuard } from '../application/guards/jwt-auth.guard'
import { CurrentUserId } from '../../../base/decorators/current-user-id.decorator'
import { SaAuthGuard } from '../application/guards/sa-auth.guard'
import { CreateUserDto } from '../../users'
import { AuthCommandService } from '../application/auth.command.service'

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly authCommandService: AuthCommandService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  meData(@CurrentUserId() currentUserId: string) {
    return currentUserId
  }

  @UseGuards(SaAuthGuard)
  @Get('sa')
  saData() {
    return { secretInfo: 'very big secret' }
  }

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  login(@Request() req: any) {
    return this.authService.login(req.user)
  }

  @Post('/registration')
  registration(@Body() createUserDto: CreateUserDto) {
    return this.authCommandService.registerUser(createUserDto)
  }
}

import { Controller, Get, UseGuards, Request, Post, Body, BadRequestException, HttpCode } from '@nestjs/common'
import { LocalAuthGuard } from '../application/guards/local-auth.guard'
import { AuthService } from '../application/auth.service'
import { JwtAuthGuard } from '../application/guards/jwt-auth.guard'
import { CurrentUserId } from '../../../base/decorators/current-user-id.decorator'
import { SaAuthGuard } from '../application/guards/sa-auth.guard'
import { CreateUserDto } from '../../users'
import { AuthCommandService } from '../application/auth.command.service'
import { ConfirmUserDto } from './models/input/confirm-user.dto'
import { HttpStatusCodes } from '../../../common/models'

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly authCommandService: AuthCommandService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
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

  @HttpCode(HttpStatusCodes.NO_CONTENT_204)
  @Post('/registration-confirmation')
  async registrationConfirm(@Body() confirmUserDto: ConfirmUserDto) {
    const confirmResult = await this.authCommandService.confirmUser(confirmUserDto.code)

    if (confirmResult.hasError()) {
      throw new BadRequestException(confirmResult.extensions)
    }
  }
}

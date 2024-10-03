import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common'
import { LocalAuthGuard } from '../application/guards/local-auth.guard'
import { AuthService } from '../application/auth.service'
import { JwtAuthGuard } from '../application/guards/jwt-auth.guard'
import { CurrentUserId } from '../../../base/decorators/current-user-id.decorator'
import { SaAuthGuard } from '../application/guards/sa-auth.guard'
import { CreateUserDto } from '../../users'
import { AuthCommandService } from '../application/auth.command.service'
import { ConfirmUserDto } from './models/input/confirm-user.dto'
import { HttpStatusCodes } from '../../../common/models'
import { SkipThrottle, ThrottlerGuard } from '@nestjs/throttler'
import { EmailDto } from './models/input/email.dto'
import { PasswordRecoveryDto } from './models/input/password-recovery.dto'

@UseGuards(ThrottlerGuard)
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly authCommandService: AuthCommandService,
  ) {}

  @SkipThrottle()
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

  @HttpCode(HttpStatusCodes.NO_CONTENT_204)
  @Post('/registration')
  async registration(@Body() createUserDto: CreateUserDto) {
    const result = await this.authCommandService.registerUser(createUserDto)

    if (result.hasError()) {
      throw new BadRequestException(result.extensions)
    }
  }

  @HttpCode(HttpStatusCodes.NO_CONTENT_204)
  @Post('/registration-confirmation')
  async registrationConfirm(@Body() confirmUserDto: ConfirmUserDto) {
    const confirmResult = await this.authCommandService.confirmUser(confirmUserDto.code)

    if (confirmResult.hasError()) {
      throw new BadRequestException(confirmResult.extensions)
    }
  }

  @HttpCode(HttpStatusCodes.NO_CONTENT_204)
  @Post('/registration-email-resending')
  async registrationEmailResending(@Body() emailDto: EmailDto) {
    const result = await this.authCommandService.registrationEmailResending(emailDto.email)

    if (result.hasError()) {
      throw new BadRequestException(result.extensions)
    }
  }

  @HttpCode(HttpStatusCodes.NO_CONTENT_204)
  @Post('/password-recovery')
  async passwordRecovery(@Body() emailDto: EmailDto) {
    const result = await this.authCommandService.passwordRecovery(emailDto.email)

    if (result.hasError()) {
      throw new HttpException(result.extensions, result.code)
    }
  }

  @HttpCode(HttpStatusCodes.NO_CONTENT_204)
  @Post('/new-password')
  async confirmNewPassword(@Body() passwordRecoveryDto: PasswordRecoveryDto) {
    const result = await this.authCommandService.confirmNewPassword(passwordRecoveryDto)

    if (result.hasError()) {
      throw new BadRequestException(result.extensions)
    }
  }
}

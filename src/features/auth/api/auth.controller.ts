import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  Post,
  Request,
  Response,
  UseGuards,
} from '@nestjs/common'
import { LocalAuthGuard } from '../application/guards/local-auth.guard'
import { JwtAuthGuard } from '../application/guards/jwt-auth.guard'
import { CurrentUserId } from '../../../base/decorators'
import { CreateUserDto } from '../../users'
import { AuthCommandService } from '../application/auth.command.service'
import { ConfirmUserDto } from './models/input/confirm-user.dto'
import { HttpStatusCodes } from '../../../common/models'
import { SkipThrottle, ThrottlerGuard } from '@nestjs/throttler'
import { EmailDto } from './models/input/email.dto'
import { PasswordRecoveryDto } from './models/input/password-recovery.dto'
import { AuthQueryRepository } from '../infrastructure/auth.query-repository'
import { RefreshTokenGuard } from '../application/guards/refresh-auth.guard'
import { AuthRequestDto } from './models/utility/auth-request.dto'

@UseGuards(ThrottlerGuard)
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authCommandService: AuthCommandService,
    private readonly authQueryRepository: AuthQueryRepository,
  ) {}

  @SkipThrottle()
  @UseGuards(JwtAuthGuard)
  @Get('me')
  meData(@CurrentUserId() currentUserId: string) {
    return this.authQueryRepository.getMeInformation(currentUserId)
  }

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async login(@Request() req: any, @Response() res: any) {
    const deviceName = req.headers['user-agent'] ?? 'Your device'
    const ip = req.ip ?? 'no_ip'

    const loginResult = await this.authCommandService.loginUser(req.user, deviceName, ip)
    if (loginResult.hasError()) {
      throw new HttpException(loginResult.extensions, loginResult.code)
    }

    const { accessToken, refreshToken } = loginResult.data

    res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true })
    return res.status(HttpStatusCodes.OK_200).send({ accessToken })
  }

  @UseGuards(RefreshTokenGuard)
  @Post('/refresh-token')
  async refreshToken(@Request() req: { user: AuthRequestDto }, @Response() res: any) {
    const refreshToken = req.user?.refreshToken

    const refreshResult = await this.authCommandService.refreshTokenPair(refreshToken)
    if (refreshResult.hasError()) {
      throw new HttpException(refreshResult.extensions, refreshResult.code)
    }

    const { accessToken, refreshToken: updatedRefreshToken } = refreshResult.data

    res.cookie('refreshToken', updatedRefreshToken, { httpOnly: true, secure: true })
    return res.status(HttpStatusCodes.OK_200).send({ accessToken })
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

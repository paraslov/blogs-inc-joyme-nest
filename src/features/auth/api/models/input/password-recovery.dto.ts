import { IsString, MaxLength, MinLength } from 'class-validator'

export class PasswordRecoveryDto {
  @IsString()
  @MinLength(6)
  @MaxLength(20)
  newPassword: string

  @IsString()
  recoveryCode: string
}

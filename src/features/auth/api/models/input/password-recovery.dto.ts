import { MaxLength, MinLength } from 'class-validator'
import { TrimmedString } from '../../../../../base/decorators'

export class PasswordRecoveryDto {
  @TrimmedString()
  @MinLength(6)
  @MaxLength(20)
  newPassword: string

  @TrimmedString()
  recoveryCode: string
}

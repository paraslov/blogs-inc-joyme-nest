import { IsEmail, Matches, MaxLength, MinLength } from 'class-validator'
import { TrimmedString } from '../../../../../base/decorators'

export class CreateUserDto {
  @TrimmedString({ required: true })
  @MinLength(3)
  @MaxLength(10)
  @Matches(/^[a-zA-Z0-9_-]*$/, {
    message: 'Invalid characters in the field. Only letters, numbers, underscore (_) and hyphen (-) are allowed.',
  })
  login: string

  @TrimmedString({ required: true })
  @MinLength(6)
  @MaxLength(20)
  password: string

  @TrimmedString({ required: true })
  @IsEmail({}, { message: 'Invalid value. Should be a valid email like "example@example.com"' })
  email: string
}

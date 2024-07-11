import { IsEmail, IsString, Matches, MaxLength, MinLength } from 'class-validator'

export class CreateUserDto {
  @IsString()
  @MinLength(3)
  @MaxLength(10)
  @Matches(/^[a-zA-Z0-9_-]*$/, {
    message: 'Invalid characters in the field. Only letters, numbers, underscore (_) and hyphen (-) are allowed.',
  })
  login: string

  @IsString()
  @MinLength(6)
  @MaxLength(20)
  password: string

  @IsString()
  @IsEmail({}, { message: 'Invalid value. Should be a valid email like "example@example.com"' })
  email: string
}

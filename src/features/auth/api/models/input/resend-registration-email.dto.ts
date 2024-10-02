import { IsEmail, IsString } from 'class-validator'

export class ResendRegistrationEmailDto {
  @IsString()
  @IsEmail({}, { message: 'Invalid value. Should be a valid email like "example@example.com"' })
  email: string
}

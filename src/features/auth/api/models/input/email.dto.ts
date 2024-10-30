import { IsEmail } from 'class-validator'
import { TrimmedString } from '../../../../../base/decorators'

export class EmailDto {
  @TrimmedString()
  @IsEmail({}, { message: 'Invalid value. Should be a valid email like "example@example.com"' })
  email: string
}

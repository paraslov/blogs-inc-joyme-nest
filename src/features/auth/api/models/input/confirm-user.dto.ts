import { IsUUID } from 'class-validator'

export class ConfirmUserDto {
  @IsUUID()
  code: string
}

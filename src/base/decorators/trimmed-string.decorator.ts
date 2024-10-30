import { applyDecorators } from '@nestjs/common'
import { IsNotEmpty, IsString } from 'class-validator'
import { Trim } from './trim.decorator'

export function TrimmedString() {
  return applyDecorators(Trim(), IsString(), IsNotEmpty())
}

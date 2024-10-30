import { applyDecorators } from '@nestjs/common'
import { IsString } from 'class-validator'
import { Trim } from './trim.decorator'

export function TrimmedString() {
  return applyDecorators(IsString(), Trim())
}

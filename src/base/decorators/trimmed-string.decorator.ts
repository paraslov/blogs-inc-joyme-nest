import { applyDecorators } from '@nestjs/common'
import { IsNotEmpty, IsString } from 'class-validator'
import { Trim } from './trim.decorator'

export function TrimmedString(options?: { required: boolean }) {
  const decorators = [Trim(), IsString()]

  if (options?.required) {
    decorators.push(IsNotEmpty())
  }

  return applyDecorators(...decorators)
}

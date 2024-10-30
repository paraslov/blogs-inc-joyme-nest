import { MaxLength, MinLength } from 'class-validator'
import { TrimmedString } from '../../../../../base/decorators'

export class CreateUpdateCommentDto {
  @TrimmedString({ required: true })
  @MinLength(20)
  @MaxLength(300)
  content: string
}

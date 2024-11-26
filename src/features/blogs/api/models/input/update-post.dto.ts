import { TrimmedString } from '../../../../../base/decorators'
import { MaxLength } from 'class-validator'

export class UpdatePostDto {
  @TrimmedString({ required: true })
  @MaxLength(30)
  title: string

  @TrimmedString({ required: true })
  @MaxLength(100)
  shortDescription: string

  @TrimmedString({ required: true })
  @MaxLength(1000)
  content: string
}

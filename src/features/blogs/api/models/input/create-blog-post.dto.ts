import { MaxLength } from 'class-validator'
import { TrimmedString } from '../../../../../base/decorators'

export class CreateBlogPostDto {
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

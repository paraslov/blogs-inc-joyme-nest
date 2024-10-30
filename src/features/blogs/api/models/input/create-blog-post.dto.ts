import { MaxLength } from 'class-validator'
import { TrimmedString } from '../../../../../base/decorators'

export class CreateBlogPostDto {
  @TrimmedString()
  @MaxLength(30)
  title: string

  @TrimmedString()
  @MaxLength(100)
  shortDescription: string

  @TrimmedString()
  @MaxLength(1000)
  content: string
}

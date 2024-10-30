import { IsUrl, MaxLength } from 'class-validator'
import { TrimmedString } from '../../../../../base/decorators'

export class CreateBlogDto {
  @TrimmedString()
  @MaxLength(15)
  name: string

  @TrimmedString()
  @MaxLength(500)
  description: string

  @TrimmedString()
  @MaxLength(100)
  @IsUrl()
  websiteUrl: string
}

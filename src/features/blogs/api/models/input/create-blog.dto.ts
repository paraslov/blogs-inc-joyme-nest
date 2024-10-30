import { IsUrl, MaxLength } from 'class-validator'
import { TrimmedString } from '../../../../../base/decorators'

export class CreateBlogDto {
  @TrimmedString({ required: true })
  @MaxLength(15)
  name: string

  @TrimmedString({ required: true })
  @MaxLength(500)
  description: string

  @TrimmedString({ required: true })
  @MaxLength(100)
  @IsUrl()
  websiteUrl: string
}

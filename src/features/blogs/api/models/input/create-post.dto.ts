import { IsNumber, IsOptional, MaxLength, Min, Validate } from 'class-validator'
import { TrimmedString } from '../../../../../base/decorators'
import { IsBlogExistsConstraint } from '../../../application/decorators/is-blog-exists.decorator'

export class CreatePostDto {
  @TrimmedString({ required: true })
  @MaxLength(30)
  title: string

  @TrimmedString({ required: true })
  @MaxLength(100)
  shortDescription: string

  @TrimmedString({ required: true })
  @MaxLength(1000)
  content: string

  @TrimmedString({ required: true })
  @Validate(IsBlogExistsConstraint)
  blogId: string

  @IsOptional()
  @IsNumber()
  @Min(0)
  likesCount?: number

  @IsOptional()
  @IsNumber()
  @Min(0)
  dislikesCount?: number
}

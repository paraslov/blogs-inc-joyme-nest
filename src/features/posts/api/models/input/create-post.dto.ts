import { IsNumber, IsOptional, MaxLength, Min, Validate } from 'class-validator'
import { Transform } from 'class-transformer'
import { toMongoObjectId } from '../../../../../base/transformers/toMongoObjectId'
import { TrimmedString } from '../../../../../base/decorators'
import { IsBlogExists, IsBlogExistsConstraint } from '../../../application/decorators/is-blog-exists.decorator'

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
  @Transform(toMongoObjectId)
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

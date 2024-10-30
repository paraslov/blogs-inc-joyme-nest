import { IsNumber, IsOptional, MaxLength, Min } from 'class-validator'
import { Transform } from 'class-transformer'
import { toMongoObjectId } from '../../../../../base/transformers/toMongoObjectId'
import { TrimmedString } from '../../../../../base/decorators'

export class CreatePostDto {
  @TrimmedString()
  @MaxLength(30)
  title: string

  @TrimmedString()
  @MaxLength(100)
  shortDescription: string

  @TrimmedString()
  @MaxLength(1000)
  content: string

  @TrimmedString()
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

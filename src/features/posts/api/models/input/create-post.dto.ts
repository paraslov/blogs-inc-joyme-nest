import { IsNumber, IsOptional, IsString, MaxLength, Min } from 'class-validator'
import { Transform } from 'class-transformer'
import { toMongoObjectId } from '../../../../../base/transformers/toMongoObjectId'

export class CreatePostDto {
  @IsString()
  @MaxLength(30)
  title: string

  @IsString()
  @MaxLength(100)
  shortDescription: string

  @IsString()
  @MaxLength(1000)
  content: string

  @IsString()
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

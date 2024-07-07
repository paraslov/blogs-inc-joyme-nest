import { IsString, MaxLength } from 'class-validator'
import { Transform } from 'class-transformer'
import { toMongoObjectId } from '../../../../../base/transformers/toMongoObjectId'

export class PostCreateDto {
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
}

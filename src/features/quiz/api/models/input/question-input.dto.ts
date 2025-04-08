import { ArrayMinSize, ArrayMaxSize, IsArray, IsString, MaxLength, MinLength } from 'class-validator'
import { TrimmedString } from '../../../../../base/decorators'

export class CreateUpdateQuestionDto {
  @TrimmedString({ required: true })
  @MinLength(10)
  @MaxLength(500)
  body: string

  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(10)
  @IsString({ each: true })
  @MinLength(1, { each: true })
  @MaxLength(50, { each: true })
  correctAnswers: string[]
}


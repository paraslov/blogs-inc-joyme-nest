import { StandardInputFilters } from '../../../../../common/models/input/QueryInputParams'
import { IsEnum, IsOptional } from 'class-validator'
import { TrimmedString } from '../../../../../base/decorators'
import { Transform } from 'class-transformer'

enum CommentSortBy {
  CREATED_AT = 'createdAt',
  CONTENT = 'content',
}

export class CommentsFilterDto extends StandardInputFilters {
  @IsOptional()
  @TrimmedString()
  @IsEnum(CommentSortBy)
  @Transform(({ value }) => (!value ? 'createdAt' : value))
  sortBy: string = 'createdAt'
}

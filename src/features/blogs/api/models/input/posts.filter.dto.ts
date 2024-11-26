import { IsEnum, IsOptional } from 'class-validator'
import { TrimmedString } from '../../../../../base/decorators'
import { Transform } from 'class-transformer'
import { StandardInputFilters } from '../../../../../common/models/input/QueryInputParams'

enum PostSortBy {
  CREATED_AT = 'createdAt',
  TITLE = 'title',
  SHORT_DESCRIPTION = 'shortDescription',
  CONTENT = 'content',
  BLOG_NAME = 'blogName',
}

export class PostFilterDto extends StandardInputFilters {
  @IsOptional()
  @TrimmedString()
  @IsEnum(PostSortBy)
  @Transform(({ value }) => (!value ? 'createdAt' : value))
  sortBy: string = 'createdAt'
}

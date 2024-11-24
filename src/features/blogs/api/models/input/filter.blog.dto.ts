import { IsEnum, IsOptional } from 'class-validator'
import { TrimmedString } from '../../../../../base/decorators'
import { Transform } from 'class-transformer'
import { StandardInputFilters } from '../../../../../common/models/input/QueryInputParams'

enum SortByFilter {
  CREATED_AT = 'createdAt',
  NAME = 'name',
  DESCRIPTION = 'description',
  WEBSITE_URL = 'websiteUrl',
  IS_MEMBERSHIP = 'isMembership',
}

export class FilterBlogDto extends StandardInputFilters {
  @IsOptional()
  @TrimmedString()
  @Transform(({ value }) => value)
  searchNameTerm: string = ''

  @IsOptional()
  @TrimmedString()
  @IsEnum(SortByFilter)
  @Transform(({ value }) => (!value ? 'createdAt' : value))
  sortBy: string = 'createdAt'
}

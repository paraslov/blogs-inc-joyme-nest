import { StandardInputFilters } from '../../../../../common/models/input/QueryInputParams'
import { IsEnum, IsOptional } from 'class-validator'
import { TrimmedString } from '../../../../../base/decorators'
import { Transform } from 'class-transformer'

enum SortByFilter {
  CREATED_AT = 'createdAt',
  LOGIN = 'login',
  EMAIL = 'email',
}

export class FilterUsersDto extends StandardInputFilters {
  @IsOptional()
  @TrimmedString()
  searchLoginTerm: string = ''

  @IsOptional()
  @TrimmedString()
  searchEmailTerm: string = ''

  @IsOptional()
  @TrimmedString()
  @IsEnum(SortByFilter)
  @Transform(({ value }) => (!value ? 'createdAt' : value))
  sortBy: string = 'createdAt'
}

import { StandardInputFilters } from '../../../../../common/models/input/QueryInputParams'
import { IsOptional } from 'class-validator'
import { TrimmedString } from '../../../../../base/decorators'

export class FilterUsersDto extends StandardInputFilters {
  @IsOptional()
  @TrimmedString()
  searchLoginTerm: string = ''

  @IsOptional()
  @TrimmedString()
  searchEmailTerm: string = ''
}

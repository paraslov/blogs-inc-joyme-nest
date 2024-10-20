import { StandardInputFilters } from '../../../../../common/models/input/QueryInputParams'
import { IsOptional, IsString } from 'class-validator'

export class FilterUsersDto extends StandardInputFilters {
  @IsOptional()
  @IsString()
  searchLoginTerm: string = ''

  @IsOptional()
  @IsString()
  searchEmailTerm: string = ''
}

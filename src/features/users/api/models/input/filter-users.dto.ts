import { StandardInputFilters } from '../../../../../common/models/input/QueryInputParams'
import { IsOptional, IsString } from 'class-validator'

export class FilterUsersDto extends StandardInputFilters {
  constructor() {
    super()

    this.searchLoginTerm = ''
    this.searchEmailTerm = ''
  }

  @IsOptional()
  @IsString()
  searchLoginTerm: string

  @IsOptional()
  @IsString()
  searchEmailTerm: string
}

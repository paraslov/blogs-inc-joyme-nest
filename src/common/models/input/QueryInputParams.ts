import { IsNumber, IsOptional, IsString } from 'class-validator'
import { SortDirection } from '../enums/sort-direction'
import { Transform } from 'class-transformer'

export class PaginationInputModel {
  pageNumber?: number
  pageSize?: number
}

export class SortingInputModel {
  sortBy?: string
  sortDirection?: 'asc' | 'desc'
}

export class StandardInputFilters implements PaginationInputModel, SortingInputModel {
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => {
    const numberValue = Number(value)
    return !numberValue ? 1 : numberValue
  })
  pageNumber: number = 1

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => {
    const numberValue = Number(value)
    return !numberValue ? 10 : numberValue
  })
  pageSize: number = 10

  @IsOptional()
  @IsString()
  @Transform(({ value }) => (!value ? 'createdAt' : value))
  sortBy: string = 'createdAt'

  @IsOptional()
  @Transform(({ value }) => (!value ? 'desc' : value))
  sortDirection: SortDirection = SortDirection.DESC
}

export class StandardInputFiltersWithSearchTerm extends StandardInputFilters {
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value)
  searchNameTerm: string = ''
}

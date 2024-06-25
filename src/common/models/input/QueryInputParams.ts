import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator'
import { SortDirection } from '../enums/SortDirection'
import { Transform } from 'class-transformer'

export class PaginationInputModel {
  pageNumber: number
  pageSize: number
}

export class SortingInputModel {
  sortBy: string
  sortDirection: 'asc' | 'desc'
}

export class SearchInputModel {
  searchNameTerm: string | null
}

export class StandardInputFilters
  implements PaginationInputModel, SortingInputModel, SearchInputModel
{
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => Number(value))
  pageNumber: number
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => Number(value))
  pageSize: number
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value)
  sortBy: string
  @IsOptional()
  @IsEnum(SortDirection)
  @Transform(({ value }) => value)
  sortDirection: SortDirection
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value)
  searchNameTerm: string

  constructor() {
    this.pageSize = 10
    this.pageNumber = 1
    this.sortBy = 'createdAt'
    this.sortDirection = SortDirection.DESC
    this.searchNameTerm = ''
  }
}

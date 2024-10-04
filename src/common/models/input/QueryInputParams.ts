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
  constructor() {
    this.pageSize = 10
    this.pageNumber = 1
    this.sortBy = 'createdAt'
    this.sortDirection = SortDirection.DESC
  }

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => {
    const numberValue = Number(value)
    if (!numberValue) {
      return 1
    }
  })
  pageNumber?: number

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => {
    const numberValue = Number(value)
    if (!numberValue) {
      return 10
    }
  })
  pageSize?: number

  @IsOptional()
  @IsString()
  @Transform(({ value }) => (!value ? 'createdAt' : value))
  sortBy?: string

  @IsOptional()
  @Transform(({ value }) => (!value ? 'desc' : value))
  sortDirection?: SortDirection
}

export class StandardInputFiltersWithSearchTerm extends StandardInputFilters {
  constructor() {
    super()

    this.searchNameTerm = ''
  }

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value)
  searchNameTerm: string
}

import { IsEnum, IsNumber, IsOptional } from 'class-validator'
import { SortDirection } from '../enums/sort-direction'
import { Transform } from 'class-transformer'
import { TrimmedString } from '../../../base/decorators'

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
  @TrimmedString()
  @Transform(({ value }) => (!value ? 'createdAt' : value))
  sortBy: string = 'createdAt'

  @IsOptional()
  @IsEnum(SortDirection)
  @Transform(({ value }) => (!value ? 'desc' : value))
  sortDirection: SortDirection = SortDirection.DESC
}

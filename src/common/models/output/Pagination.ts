export class PaginationOutputModel {
  pagesCount: number
  page: number
  pageSize: number
  totalCount: number
}

export class PaginatedOutputEntity<T> extends PaginationOutputModel {
  items: T
}

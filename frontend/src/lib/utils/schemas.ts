export type SortType = 'asc' | 'desc'

export interface CommonPaginatedRequest {
  page: number
  pageSize: number
  sortType?: SortType | null
}

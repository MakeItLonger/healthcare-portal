import { SortParams } from './sort-params.model';

export interface QueryRequest {
  search: string;
  sort: SortParams;
  limit: string;
  page: string;
}

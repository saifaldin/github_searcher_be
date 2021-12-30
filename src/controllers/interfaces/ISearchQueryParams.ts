import { SearchTypes } from '../enums/types.enum';

export interface ISearchQueryParams {
  text: string,
  type: SearchTypes,
  page: number,
  limit: number,
}
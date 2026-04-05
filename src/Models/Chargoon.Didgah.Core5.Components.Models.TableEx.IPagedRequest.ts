import { SortOrder } from "./Chargoon.Didgah.Core5.Components.Models.Common.SortOrder";

export interface IPagedRequest<T> {
  PageSize: number;
  PageIndex: number;
  Metadata: T;
  SortField: string;
  SortOrder: SortOrder;
}

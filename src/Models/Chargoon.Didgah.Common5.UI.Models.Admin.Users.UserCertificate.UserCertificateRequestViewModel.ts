import { IPagedRequest } from "./Chargoon.Didgah.Core5.Components.Models.TableEx.IPagedRequest";
import { SortOrder } from "./Chargoon.Didgah.Core5.Components.Models.Common.SortOrder";

export interface UserCertificateRequestViewModel {
  PageSize: number;
  PageIndex: number;
  Metadata: string;
  SortField: string;
  SortOrder: SortOrder;
}

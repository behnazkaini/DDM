import { IPagedRequest } from "./Chargoon.Didgah.Core5.Components.Models.TableEx.IPagedRequest";
import { CascadeAccessesFilterViewModel } from "./Chargoon.Didgah.Common5.UI.Models.Admin.CascadeAccesses.CascadeAccessesFilterViewModel";
import { SortOrder } from "./Chargoon.Didgah.Core5.Components.Models.Common.SortOrder";

export interface CascadeAccessesPagedRequestViewModel {
  PageSize: number;
  PageIndex: number;
  Metadata: CascadeAccessesFilterViewModel;
  SortField: string;
  SortOrder: SortOrder;
}

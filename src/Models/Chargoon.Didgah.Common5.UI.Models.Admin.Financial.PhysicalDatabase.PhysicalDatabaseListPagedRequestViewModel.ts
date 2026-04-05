import { IPagedRequest } from "./Chargoon.Didgah.Core5.Components.Models.TableEx.IPagedRequest";
import { PhysicalDatabaseFilterViewModel } from "./Chargoon.Didgah.Common5.UI.Models.Admin.Financial.PhysicalDatabase.PhysicalDatabaseFilterViewModel";
import { SortOrder } from "./Chargoon.Didgah.Core5.Components.Models.Common.SortOrder";

export interface PhysicalDatabaseListPagedRequestViewModel {
  PageSize: number;
  PageIndex: number;
  Metadata: PhysicalDatabaseFilterViewModel;
  SortField: string;
  SortOrder: SortOrder;
}

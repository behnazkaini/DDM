import { IPagedRequest } from "./Chargoon.Didgah.Core5.Components.Models.TableEx.IPagedRequest";
import { StaffRelationHistoryFilterViewModel } from "./Chargoon.Didgah.Common5.UI.Models.Admin.StaffRelationHistory.StaffRelationHistoryFilterViewModel";
import { SortOrder } from "./Chargoon.Didgah.Core5.Components.Models.Common.SortOrder";

export interface StaffRelationHistoryPagedRequestViewModel {
  PageSize: number;
  PageIndex: number;
  Metadata: StaffRelationHistoryFilterViewModel;
  SortField: string;
  SortOrder: SortOrder;
}

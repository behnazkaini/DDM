import { IPagedRequest } from "./Chargoon.Didgah.Core5.Components.Models.TableEx.IPagedRequest";
import { UserRelationHistoryReportFilterViewModel } from "./Chargoon.Didgah.Common5.UI.Models.Admin.UserRelationHistoryReport.UserRelationHistoryReportFilterViewModel";
import { SortOrder } from "./Chargoon.Didgah.Core5.Components.Models.Common.SortOrder";

export interface UserRelationHistoryPagedRequestViewModel {
  PageSize: number;
  PageIndex: number;
  Metadata: UserRelationHistoryReportFilterViewModel;
  SortField: string;
  SortOrder: SortOrder;
}

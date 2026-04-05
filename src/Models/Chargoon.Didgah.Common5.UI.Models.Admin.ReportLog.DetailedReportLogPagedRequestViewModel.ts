import { IPagedRequest } from "./Chargoon.Didgah.Core5.Components.Models.TableEx.IPagedRequest";
import { DetailedReportLogRequestViewModel } from "./Chargoon.Didgah.Common5.UI.Models.Admin.ReportLog.DetailedReportLogRequestViewModel";
import { SortOrder } from "./Chargoon.Didgah.Core5.Components.Models.Common.SortOrder";

export interface DetailedReportLogPagedRequestViewModel {
  PageSize: number;
  PageIndex: number;
  Metadata: DetailedReportLogRequestViewModel;
  SortField: string;
  SortOrder: SortOrder;
}

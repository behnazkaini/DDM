import { IPagedRequest } from "./Chargoon.Didgah.Core5.Components.Models.TableEx.IPagedRequest";
import { ViewedReportsFilterViewModel } from "./Chargoon.Didgah.Common5.UI.Models.Admin.ViewedReportsReport.ViewedReportsFilterViewModel";
import { SortOrder } from "./Chargoon.Didgah.Core5.Components.Models.Common.SortOrder";

export interface ViewedReportsPagedRequestViewModel {
  PageSize: number;
  PageIndex: number;
  Metadata: ViewedReportsFilterViewModel;
  SortField: string;
  SortOrder: SortOrder;
}

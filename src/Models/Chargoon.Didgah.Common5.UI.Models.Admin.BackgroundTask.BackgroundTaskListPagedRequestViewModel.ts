import { IPagedRequest } from "./Chargoon.Didgah.Core5.Components.Models.TableEx.IPagedRequest";
import { BackgroundTaskFilterViewModel } from "./Chargoon.Didgah.Common5.UI.Models.Admin.BackgroundTask.BackgroundTaskFilterViewModel";
import { SortOrder } from "./Chargoon.Didgah.Core5.Components.Models.Common.SortOrder";

export interface BackgroundTaskListPagedRequestViewModel {
  PageSize: number;
  PageIndex: number;
  Metadata: BackgroundTaskFilterViewModel;
  SortField: string;
  SortOrder: SortOrder;
}

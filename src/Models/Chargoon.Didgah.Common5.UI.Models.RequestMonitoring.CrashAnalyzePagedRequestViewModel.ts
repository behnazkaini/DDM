import { IPagedRequest } from "./Chargoon.Didgah.Core5.Components.Models.TableEx.IPagedRequest";
import { RequestFilterViewModel } from "./Chargoon.Didgah.Common5.UI.Models.RequestMonitoring.RequestFilterViewModel";
import { SortOrder } from "./Chargoon.Didgah.Core5.Components.Models.Common.SortOrder";

export interface CrashAnalyzePagedRequestViewModel {
  PageSize: number;
  PageIndex: number;
  Metadata: RequestFilterViewModel;
  SortField: string;
  SortOrder: SortOrder;
}

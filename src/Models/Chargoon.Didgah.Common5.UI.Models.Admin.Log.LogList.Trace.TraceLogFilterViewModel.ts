import { IPagedRequest } from "./Chargoon.Didgah.Core5.Components.Models.TableEx.IPagedRequest";
import { TraceLogFilterMetaDataViewModel } from "./Chargoon.Didgah.Common5.UI.Models.Admin.Log.LogList.Trace.TraceLogFilterMetaDataViewModel";
import { SortOrder } from "./Chargoon.Didgah.Core5.Components.Models.Common.SortOrder";

export interface TraceLogFilterViewModel {
  PageSize: number;
  PageIndex: number;
  Metadata: TraceLogFilterMetaDataViewModel;
  SortField: string;
  SortOrder: SortOrder;
}

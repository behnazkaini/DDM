import { IPagedRequest } from "./Chargoon.Didgah.Core5.Components.Models.TableEx.IPagedRequest";
import { DebugLogFilterMetaDataViewModel } from "./Chargoon.Didgah.Common5.UI.Models.Admin.Log.LogList.Debug.DebugLogFilterMetaDataViewModel";
import { SortOrder } from "./Chargoon.Didgah.Core5.Components.Models.Common.SortOrder";

export interface DebugLogFilterViewModel {
  PageSize: number;
  PageIndex: number;
  Metadata: DebugLogFilterMetaDataViewModel;
  SortField: string;
  SortOrder: SortOrder;
}

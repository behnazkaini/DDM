import { IPagedRequest } from "./Chargoon.Didgah.Core5.Components.Models.TableEx.IPagedRequest";
import { WarnLogFilterMetaDataViewModel } from "./Chargoon.Didgah.Common5.UI.Models.Admin.Log.LogList.Warn.WarnLogFilterMetaDataViewModel";
import { SortOrder } from "./Chargoon.Didgah.Core5.Components.Models.Common.SortOrder";

export interface WarnLogFilterViewModel {
  PageSize: number;
  PageIndex: number;
  Metadata: WarnLogFilterMetaDataViewModel;
  SortField: string;
  SortOrder: SortOrder;
}

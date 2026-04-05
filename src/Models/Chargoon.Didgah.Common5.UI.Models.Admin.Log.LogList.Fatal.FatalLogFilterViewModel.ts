import { IPagedRequest } from "./Chargoon.Didgah.Core5.Components.Models.TableEx.IPagedRequest";
import { FatalLogFilterMetaDataViewModel } from "./Chargoon.Didgah.Common5.UI.Models.Admin.Log.LogList.Fatal.FatalLogFilterMetaDataViewModel";
import { SortOrder } from "./Chargoon.Didgah.Core5.Components.Models.Common.SortOrder";

export interface FatalLogFilterViewModel {
  PageSize: number;
  PageIndex: number;
  Metadata: FatalLogFilterMetaDataViewModel;
  SortField: string;
  SortOrder: SortOrder;
}

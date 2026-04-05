import { IPagedRequest } from "./Chargoon.Didgah.Core5.Components.Models.TableEx.IPagedRequest";
import { InfoLogFilterMetaDataViewModel } from "./Chargoon.Didgah.Common5.UI.Models.Admin.Log.LogList.Info.InfoLogFilterMetaDataViewModel";
import { SortOrder } from "./Chargoon.Didgah.Core5.Components.Models.Common.SortOrder";

export interface InfoLogFilterViewModel {
  PageSize: number;
  PageIndex: number;
  Metadata: InfoLogFilterMetaDataViewModel;
  SortField: string;
  SortOrder: SortOrder;
}

import { IPagedRequest } from "./Chargoon.Didgah.Core5.Components.Models.TableEx.IPagedRequest";
import { EntityChangeLogFilterMetaDataViewModel } from "./Chargoon.Didgah.Common5.UI.Models.Admin.Log.LogList.EntityChange.EntityChangeLogFilterMetaDataViewModel";
import { SortOrder } from "./Chargoon.Didgah.Core5.Components.Models.Common.SortOrder";

export interface EntityChangeLogFilterViewModel {
  PageSize: number;
  PageIndex: number;
  Metadata: EntityChangeLogFilterMetaDataViewModel;
  SortField: string;
  SortOrder: SortOrder;
}

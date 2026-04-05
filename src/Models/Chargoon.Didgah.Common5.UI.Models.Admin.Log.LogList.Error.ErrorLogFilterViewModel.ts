import { IPagedRequest } from "./Chargoon.Didgah.Core5.Components.Models.TableEx.IPagedRequest";
import { ErrorLogFilterMetaDataViewModel } from "./Chargoon.Didgah.Common5.UI.Models.Admin.Log.LogList.Error.ErrorLogFilterMetaDataViewModel";
import { SortOrder } from "./Chargoon.Didgah.Core5.Components.Models.Common.SortOrder";

export interface ErrorLogFilterViewModel {
  PageSize: number;
  PageIndex: number;
  Metadata: ErrorLogFilterMetaDataViewModel;
  SortField: string;
  SortOrder: SortOrder;
}

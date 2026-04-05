import { IPagedRequest } from "./Chargoon.Didgah.Core5.Components.Models.TableEx.IPagedRequest";
import { FrozenObjectFilterViewModel } from "./Chargoon.Didgah.Common5.UI.Models.Frozen.FrozenObjectFilterViewModel";
import { SortOrder } from "./Chargoon.Didgah.Core5.Components.Models.Common.SortOrder";

export interface FrozenObjectSearchRequestPagedViewModel {
  PageSize: number;
  PageIndex: number;
  Metadata: FrozenObjectFilterViewModel;
  SortField: string;
  SortOrder: SortOrder;
}

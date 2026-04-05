import { IPagedRequest } from "./Chargoon.Didgah.Core5.Components.Models.TableEx.IPagedRequest";
import { WebHookFilterViewModel } from "./Chargoon.Didgah.Common5.UI.Models.Admin.ManageWebHook.WebHookFilterViewModel";
import { SortOrder } from "./Chargoon.Didgah.Core5.Components.Models.Common.SortOrder";

export interface WebHookPagedSearchRequestViewModel {
  PageSize: number;
  PageIndex: number;
  Metadata: WebHookFilterViewModel;
  SortField: string;
  SortOrder: SortOrder;
}

import { IPagedRequest } from "./Chargoon.Didgah.Core5.Components.Models.TableEx.IPagedRequest";
import { SmsProviderFilterViewModel } from "./Chargoon.Didgah.Common5.UI.Models.Admin.SmsProvider.SmsProviderFilterViewModel";
import { SortOrder } from "./Chargoon.Didgah.Core5.Components.Models.Common.SortOrder";

export interface SmsProviderPagedSearchRequestViewModel {
  PageSize: number;
  PageIndex: number;
  Metadata: SmsProviderFilterViewModel;
  SortField: string;
  SortOrder: SortOrder;
}

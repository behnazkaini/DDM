import { IPagedResponse } from "./Chargoon.Didgah.Core5.Components.Models.TableEx.IPagedResponse";
import { SmsProviderItemViewModel } from "./Chargoon.Didgah.Common5.UI.Models.Admin.SmsProvider.SmsProviderItemViewModel";

export interface SmsProviderPagedSearchResponseViewModel {
  Data: SmsProviderItemViewModel[];
  Total: number;
}

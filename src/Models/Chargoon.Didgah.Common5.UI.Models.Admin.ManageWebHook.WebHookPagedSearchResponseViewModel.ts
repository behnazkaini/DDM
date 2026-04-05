import { IPagedResponse } from "./Chargoon.Didgah.Core5.Components.Models.TableEx.IPagedResponse";
import { WebHookBriefViewModel } from "./Chargoon.Didgah.Common5.UI.Models.Admin.ManageWebHook.WebHookBriefViewModel";

export interface WebHookPagedSearchResponseViewModel {
  Data: WebHookBriefViewModel[];
  Total: number;
}

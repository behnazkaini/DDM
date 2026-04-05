import { GenericKeyValuePair } from "./Chargoon.Didgah.Common5.UI.Models.Admin.GenericKeyValuePair";
import { WebHookEventCategoriesViewModel } from "./Chargoon.Didgah.Common5.UI.Models.Admin.ManageWebHook.WebHookEventCategoriesViewModel";

export interface WebHookEventInitViewModel {
  Softwares: GenericKeyValuePair<string>[];
  Categories: { [key: string]: WebHookEventCategoriesViewModel[]; };
}

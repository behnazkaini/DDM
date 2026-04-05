import { WebHookEventSaveViewModel } from "./Chargoon.Didgah.Common5.UI.Models.Admin.ManageWebHook.WebHookEventSaveViewModel";

export interface WebHookEventSaveAllViewModel {
  WebHookGuid: string;
  Added: WebHookEventSaveViewModel[];
  Edited: WebHookEventSaveViewModel[];
  Deleted: WebHookEventSaveViewModel[];
}

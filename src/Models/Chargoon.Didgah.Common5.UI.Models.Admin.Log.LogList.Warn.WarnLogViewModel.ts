import { LogBase } from "./Chargoon.Didgah.Common5.UI.Models.Admin.Log.LogList.LogBase";

export interface WarnLogViewModel extends LogBase {
  EventId: number;
  EventTitle: string;
  ReferenceGuid: string;
  ReferenceId: number;
}

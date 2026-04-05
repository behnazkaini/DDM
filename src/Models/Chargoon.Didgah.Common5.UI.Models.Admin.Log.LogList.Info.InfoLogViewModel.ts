import { LogBase } from "./Chargoon.Didgah.Common5.UI.Models.Admin.Log.LogList.LogBase";

export interface InfoLogViewModel extends LogBase {
  EventId: number;
  EventTitle: string;
  ReferenceGuid: string;
  ReferenceId: number;
  FingerPrint: string;
}

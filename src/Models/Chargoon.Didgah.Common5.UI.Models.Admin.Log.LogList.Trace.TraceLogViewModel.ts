import { LogBase } from "./Chargoon.Didgah.Common5.UI.Models.Admin.Log.LogList.LogBase";

export interface TraceLogViewModel extends LogBase {
  Url: string;
  StackTrace: string;
  FingerPrint: string;
}

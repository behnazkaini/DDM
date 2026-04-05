import { LogBase } from "./Chargoon.Didgah.Common5.UI.Models.Admin.Log.LogList.LogBase";

export interface FatalLogViewModel extends LogBase {
  Url: string;
  StackTrace: string;
  FeedbackId: number;
}

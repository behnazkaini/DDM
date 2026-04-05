import { LogBase } from "./Chargoon.Didgah.Common5.UI.Models.Admin.Log.LogList.LogBase";

export interface ErrorLogViewModel extends LogBase {
  Url: string;
  StackTrace: string;
  FeedbackId: number;
}

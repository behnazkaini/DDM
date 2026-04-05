import { GenericKeyValuePair } from "./Chargoon.Didgah.Common5.UI.Models.Admin.GenericKeyValuePair";

export interface WorkflowInitViewModel {
  SoftwareGuids: GenericKeyValuePair<string>[];
  CanPause: boolean;
  CanResume: boolean;
  CanTerminate: boolean;
}

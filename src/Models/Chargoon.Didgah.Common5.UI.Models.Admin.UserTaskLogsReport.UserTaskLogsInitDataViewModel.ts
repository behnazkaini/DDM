import { GenericKeyValuePair } from "./Chargoon.Didgah.Common5.UI.Models.Admin.GenericKeyValuePair";

export interface UserTaskLogsInitDataViewModel {
  AvailableServers: GenericKeyValuePair<string>[];
  AvailableReportSortFields: GenericKeyValuePair<string>[];
  ReportSortTypes: GenericKeyValuePair<string>[];
  Events: GenericKeyValuePair<number>[];
  IsSyncServerAvailable: boolean;
}

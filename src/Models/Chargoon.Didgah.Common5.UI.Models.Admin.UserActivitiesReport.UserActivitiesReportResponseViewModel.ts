import { GenericKeyValuePair } from "./Chargoon.Didgah.Common5.UI.Models.Admin.GenericKeyValuePair";

export interface UserActivitiesReportResponseViewModel {
  AvailableServers: GenericKeyValuePair<string>[];
  AvailableReportSortFields: GenericKeyValuePair<string>[];
  ReportSortTypes: GenericKeyValuePair<string>[];
  IsSyncServerAvailable: boolean;
}

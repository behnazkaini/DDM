import { GenericKeyValuePair } from "./Chargoon.Didgah.Common5.UI.Models.Admin.GenericKeyValuePair";

export interface AttemptToUnauthorizedAccessReportInitDataViewModel {
  ReportSortTypes: GenericKeyValuePair<string>[];
  AvailableReportSortFields: GenericKeyValuePair<string>[];
}

import { GenericKeyValuePair } from "./Chargoon.Didgah.Common5.UI.Models.Admin.GenericKeyValuePair";

export interface OrganizationChartReportInitDataResponseViewModel {
  IsSyncServerAvailable: boolean;
  OperationServers: GenericKeyValuePair<string>[];
}

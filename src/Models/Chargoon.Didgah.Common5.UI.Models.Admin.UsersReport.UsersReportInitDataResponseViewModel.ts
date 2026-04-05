import { GenericKeyValuePair } from "./Chargoon.Didgah.Common5.UI.Models.Admin.GenericKeyValuePair";

export interface UsersReportInitDataResponseViewModel {
  Conditions: GenericKeyValuePair<number>[];
  AvailableReportSortFields: GenericKeyValuePair<string>[];
  IsSecretarialAvailable: boolean;
  Secretarials: GenericKeyValuePair<string>[];
  IsSyncServerAvailable: boolean;
  OperationServers: GenericKeyValuePair<string>[];
}

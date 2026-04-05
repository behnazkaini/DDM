import { GenericKeyValuePair } from "./Chargoon.Didgah.Common5.UI.Models.Admin.GenericKeyValuePair";

export interface StaffGroupsReportInitDataResponseViewModel {
  StaffGroups: GenericKeyValuePair<string>[];
  IsSecretarialAvailable: boolean;
  Secretarials: GenericKeyValuePair<string>[];
  IsSyncServerAvailable: boolean;
  OperationServers: GenericKeyValuePair<string>[];
}

import { GenericKeyValuePair } from "./Chargoon.Didgah.Common5.UI.Models.Admin.GenericKeyValuePair";

export interface DepartmentInitViewModel {
  IsSyncServerAvailable: boolean;
  IsAnyFinancialSystemAvailable: boolean;
  Databases: GenericKeyValuePair<string>[];
  OperationServers: GenericKeyValuePair<string>[];
  EmailToken: string;
}

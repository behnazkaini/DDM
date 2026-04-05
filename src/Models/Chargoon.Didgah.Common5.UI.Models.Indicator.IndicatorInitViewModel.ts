import { GenericKeyValuePair } from "./Chargoon.Didgah.Common5.UI.Models.Admin.GenericKeyValuePair";

export interface IndicatorInitViewModel {
  IsSyncServerAvailable: boolean;
  OperationServers: GenericKeyValuePair<string>[];
  ReferenceEntities: GenericKeyValuePair<string>[];
  IndicatorRepositories: GenericKeyValuePair<string>[];
}

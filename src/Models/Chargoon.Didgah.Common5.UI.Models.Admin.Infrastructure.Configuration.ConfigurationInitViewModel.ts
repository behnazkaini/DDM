import { SoftwaresViewModel } from "./Chargoon.Didgah.Common5.UI.Models.Admin.Infrastructure.Configuration.SoftwaresViewModel";
import { GenericKeyValuePair } from "./Chargoon.Didgah.Common5.UI.Models.Admin.GenericKeyValuePair";

export interface ConfigurationInitViewModel {
  softwares: SoftwaresViewModel[];
  serverNames: GenericKeyValuePair<string>[];
  instanceNames: GenericKeyValuePair<string>[];
}

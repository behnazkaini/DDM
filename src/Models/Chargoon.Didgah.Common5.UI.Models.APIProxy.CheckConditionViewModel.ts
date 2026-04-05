import { ProxyMethodErrorMappingViewModel } from "./Chargoon.Didgah.Common5.UI.Models.APIProxy.ProxyMethodErrorMappingViewModel";

export interface CheckConditionViewModel {
  JsonBody: string;
  StatusCode: string;
  ErrorMappings: ProxyMethodErrorMappingViewModel[];
}

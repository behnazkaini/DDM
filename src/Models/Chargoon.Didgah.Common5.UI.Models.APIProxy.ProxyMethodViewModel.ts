import { ProxyMethodParameterViewModel } from "./Chargoon.Didgah.Common5.UI.Models.APIProxy.ProxyMethodParameterViewModel";
import { ProxyMethodErrorMappingViewModel } from "./Chargoon.Didgah.Common5.UI.Models.APIProxy.ProxyMethodErrorMappingViewModel";

export interface ProxyMethodViewModel {
  Guid: string;
  ProxyGuid: string;
  ScopeGuid: string;
  Title: string;
  EndPoint: string;
  ReferenceGuid: string;
  OwnerTite: string;
  IsActive: boolean;
  Inputs: ProxyMethodParameterViewModel[];
  Outputs: ProxyMethodParameterViewModel[];
  ErrorMappings: ProxyMethodErrorMappingViewModel[];
}

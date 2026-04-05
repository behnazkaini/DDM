import { ApiCallParametersViewModel } from "./Chargoon.Didgah.Common5.UI.Models.APIProxy.ApiCallParametersViewModel";

export interface ApiRequestViewModel {
  EndPoint: string;
  ReferenceGuid: string;
  Parameters: ApiCallParametersViewModel[];
}

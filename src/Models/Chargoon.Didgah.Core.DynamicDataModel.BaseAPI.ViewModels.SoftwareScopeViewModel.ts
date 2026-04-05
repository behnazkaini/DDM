import { ScopeViewModel } from "./Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.ScopeViewModel";

export interface SoftwareScopeViewModel {
  SoftwareGuid: string;
  SoftwareTitle: string;
  Scopes: ScopeViewModel[];
}

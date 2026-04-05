import { DataModelType } from "./Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.DataModelType";

export interface DataModelBriefFilterViewModel {
  SoftwareGuid: string;
  ScopeGuid: string;
  Type: DataModelType;
  Name: string;
  Label: string;
}

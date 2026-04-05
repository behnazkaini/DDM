import { DataModelType } from "./Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.DataModelType";
import { LayoutBriefViewModel } from "./Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.LayoutBriefViewModel";

export interface DataModelBriefViewModel {
  Guid: string;
  SoftwareGuid: string;
  ScopeGuid: string;
  Name: string;
  Label: string;
  Type: DataModelType;
  Layouts: LayoutBriefViewModel[];
}

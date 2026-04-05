import { SoftwareSettingType } from "./Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.SoftwareSettingType";

export interface DataModelSettingViewModel {
  Guid: string;
  Name: string;
  Label: string;
  Type: SoftwareSettingType;
}

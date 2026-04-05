import { LayoutType } from "./Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.LayoutType";

export interface LayoutBriefPagedFilterViewModel {
  DataModelGuid: string;
  Type: LayoutType;
  Label: string;
  IsDefault: boolean;
}

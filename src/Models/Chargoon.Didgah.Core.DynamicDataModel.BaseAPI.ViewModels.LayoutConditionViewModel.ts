import { LayoutConditionType } from "./Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.LayoutConditionType";

export interface LayoutConditionViewModel {
  Guid: string;
  ItemGuid: string;
  Type: LayoutConditionType;
  Setting: string;
}

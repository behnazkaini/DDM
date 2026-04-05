import { LayoutConditionType } from "./Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.LayoutConditionType";

export class SaveLayoutConditionViewModel {
  Guid: string;
  LayoutItemGuid: string;
  Type: LayoutConditionType;
  Setting: string;
}

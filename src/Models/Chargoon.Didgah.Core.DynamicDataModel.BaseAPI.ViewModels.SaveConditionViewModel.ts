import { ConditionType } from "./Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.ConditionType";

export class SaveConditionViewModel {
  Guid: string;
  LayoutItemGuid: string;
  Type: ConditionType;
  Setting: string;
}

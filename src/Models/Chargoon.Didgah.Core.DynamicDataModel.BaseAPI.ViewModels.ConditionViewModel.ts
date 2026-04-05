import { ConditionType } from "./Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.ConditionType";

export class ConditionViewModel {
  Guid: string;
  ItemGuid: string;
  Type: ConditionType;
  Setting: string;
}

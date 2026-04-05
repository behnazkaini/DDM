import { SaveConditionViewModel } from "./Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.SaveConditionViewModel";
import { ConditionGroupType } from "./Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.ConditionGroupType";

export class SaveConditionGroupViewModel {
  Guid: string;
  ConditionGroups: SaveConditionGroupViewModel[];
  Conditions: SaveConditionViewModel[];
  Type: ConditionGroupType;
}

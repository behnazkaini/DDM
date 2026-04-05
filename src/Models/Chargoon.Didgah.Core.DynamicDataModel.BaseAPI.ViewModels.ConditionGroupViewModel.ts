import { ConditionViewModel } from "./Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.ConditionViewModel";
import { ConditionGroupType } from "./Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.ConditionGroupType";

export interface ConditionGroupViewModel {
  Guid: string;
  ConditionGroups: ConditionGroupViewModel[];
  Conditions: ConditionViewModel[];
  Type: ConditionGroupType;
}

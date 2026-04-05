import { LayoutConditionViewModel } from "./Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.LayoutConditionViewModel";
import { LayoutConditionGroupType } from "./Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.LayoutConditionGroupType";

export interface LayoutConditionGroupViewModel {
  Guid: string;
  ConditionGroups: LayoutConditionGroupViewModel[];
  Conditions: LayoutConditionViewModel[];
  Type: LayoutConditionGroupType;
}

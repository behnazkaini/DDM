import { ConditionGroupType } from "./Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.ConditionGroupType";
import { SearchConditionViewModel } from "./Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.SearchConditionViewModel";

export class SearchConditionGroupViewModel {
  Type: ConditionGroupType;
  Conditions: SearchConditionViewModel[];
  ConditionGroups: SearchConditionGroupViewModel[];
}

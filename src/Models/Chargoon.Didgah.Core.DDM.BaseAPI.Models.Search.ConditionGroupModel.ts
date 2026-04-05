import { LogicalOperatorType } from "./Chargoon.Didgah.DynamicDataModel.Enumerations.LogicalOperatorType";
import { ConditionModel } from "./Chargoon.Didgah.Core.DDM.BaseAPI.Models.Search.ConditionModel";

export interface ConditionGroupModel {
  OperatorType: LogicalOperatorType;
  ConditionGroups: ConditionGroupModel[];
  Conditions: ConditionModel[];
}

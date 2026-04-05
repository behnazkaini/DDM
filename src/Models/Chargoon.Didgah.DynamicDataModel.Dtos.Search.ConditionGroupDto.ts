import { LogicalOperatorType } from "./Chargoon.Didgah.DynamicDataModel.Enumerations.LogicalOperatorType";
import { ConditionDto } from "./Chargoon.Didgah.DynamicDataModel.Dtos.Search.ConditionDto";

export class ConditionGroupDto {
  OperatorType: LogicalOperatorType;
  Groups: ConditionGroupDto[];
  Conditions: ConditionDto[];
}

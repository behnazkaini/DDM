import { RelationalOperatorType } from "./Chargoon.Didgah.DynamicDataModel.Enumerations.RelationalOperatorType";

export class ConditionDto {
  HierarchyId: string;
  FieldInstanceId: number;
  OperatorType: RelationalOperatorType;
  Values: Object[];
}

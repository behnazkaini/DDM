import { TypeInstanceParentType } from "./Chargoon.Didgah.DynamicDataModel.TypeInstanceParentType";
import { RelationalOperatorType } from "./Chargoon.Didgah.DynamicDataModel.Enumerations.RelationalOperatorType";

export interface ConditionModel {
  FieldId: number;
  ParentType: TypeInstanceParentType;
  OperatorType: RelationalOperatorType;
  TypeGuid: string;
  Value: Object;
}

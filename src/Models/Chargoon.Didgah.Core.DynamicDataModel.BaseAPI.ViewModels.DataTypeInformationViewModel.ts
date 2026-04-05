import { ColumnDataType } from "./Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.ColumnDataType";
import { ConditionType } from "./Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.ConditionType";

export interface DataTypeInformationViewModel {
  Type: ColumnDataType;
  Conditions: ConditionType[];
  SearchCondition: ConditionType[];
}

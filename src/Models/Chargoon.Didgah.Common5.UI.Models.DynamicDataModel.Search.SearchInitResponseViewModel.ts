import { TreeNodeModel } from "./Chargoon.Didgah.Core.DDM.BaseAPI.Models.Search.TreeNodeModel";
import { LogicalOperatorType } from "./Chargoon.Didgah.DynamicDataModel.Enumerations.LogicalOperatorType";
import { RelationalOperatorType } from "./Chargoon.Didgah.DynamicDataModel.Enumerations.RelationalOperatorType";

export interface SearchInitResponseViewModel {
  DataModelId: number;
  SearchTreeItems: TreeNodeModel;
  LogicalOperators: LogicalOperatorType[];
  FieldsOperators: { [key: string]: RelationalOperatorType[]; };
  SearchWidgetIds: { [key: string]: string; };
  DisplayWidgetIds: { [key: string]: string; };
}

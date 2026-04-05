import { DataModelType } from "./Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.DataModelType";
import { ColumnViewModel } from "./Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.ColumnViewModel";
import { RelationViewModel } from "./Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.RelationViewModel";
import { DataModelVariableViewModel } from "./Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.DataModel.DataModelVariableViewModel";
import { InputVariableTypeViewModel } from "./Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.DataModel.Variables.InputVariableTypeViewModel";
import { SettingViewModel } from "../Core.DynamicDataModel/Modeler/GraphModels/Relation";

export interface DataModelViewModel {
  Guid: string;
  SoftwareGuid: string;
  ScopeGuid: string;
  Name: string;
  Label: string;
  Type: DataModelType;
  Columns: ColumnViewModel[];
  Relations: RelationViewModel[];
  Variables: DataModelVariableViewModel[];
  InputVariableType: InputVariableTypeViewModel;
  Settings?: SettingViewModel[]
}

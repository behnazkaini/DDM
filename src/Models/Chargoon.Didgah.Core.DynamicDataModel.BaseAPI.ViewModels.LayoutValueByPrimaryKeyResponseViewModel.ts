import { DataModelViewModel } from "./Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.DataModelViewModel";
import { LayoutViewModel } from "./Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.LayoutViewModel";
import { RowViewModelWithGuidKey } from "./Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.RowViewModelWithGuidKey";
import { VariableViewModel } from "./Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.DataModel.Variables.VariableViewModel";

export interface LayoutValueByPrimaryKeyResponseViewModel {
  DataModels: DataModelViewModel[];
  Layouts: LayoutViewModel[];
  Row: RowViewModelWithGuidKey;
  Variables: VariableViewModel[];
}

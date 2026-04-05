import { DataModelViewModel } from "./Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.DataModelViewModel";
import { LayoutViewModel } from "./Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.LayoutViewModel";

export interface LayoutResponseViewModel {
  DataModels: DataModelViewModel[];
  Layouts: LayoutViewModel[];
}

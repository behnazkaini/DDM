import { DataModelViewModel } from "./Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.DataModelViewModel";
import { LayoutViewModel } from "./Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.LayoutViewModel";
import { RowViewModelWithGuidKey } from "./Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.RowViewModelWithGuidKey";

export interface LayoutValueResponseViewModel {
  DataModels: DataModelViewModel[];
  Layouts: LayoutViewModel[];
  Rows: RowViewModelWithGuidKey[];
  Guid?: string;
}

import { DataModelViewModel } from "./Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.DataModelViewModel";
import { DataModelSettingViewModel } from "./Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.DataModel.Settings.DataModelSettingViewModel";

export interface SoftwareModelViewModel extends DataModelViewModel {
  Settings?: DataModelSettingViewModel[];
}

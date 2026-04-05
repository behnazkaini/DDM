import { AddDataModelViewModel } from "./Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.AddDataModelViewModel";
import { ModifyDataModelViewModel } from "./Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.ModifyDataModelViewModel";

export interface SaveDataModelChangesViewModel {
  Added: AddDataModelViewModel[];
  Modified: ModifyDataModelViewModel[];
}

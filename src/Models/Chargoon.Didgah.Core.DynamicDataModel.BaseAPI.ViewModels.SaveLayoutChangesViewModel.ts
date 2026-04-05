import { AddLayoutViewModel } from "./Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.AddLayoutViewModel";
import { ModifyLayoutViewModel } from "./Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.ModifyLayoutViewModel";

export interface SaveLayoutChangesViewModel {
  Added: AddLayoutViewModel[];
  Modified: ModifyLayoutViewModel[];
}

import { SaveLayoutChangesViewModel } from "./Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.SaveLayoutChangesViewModel";
import { SaveDataModelChangesViewModel } from "./Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.SaveDataModelChangesViewModel";

export interface SaveSimpleChangesViewModel {
  SaveLayoutChanges: SaveLayoutChangesViewModel;
  SaveDataModelChanges: SaveDataModelChangesViewModel;
}

import { SaveLayoutItemViewModel } from "./Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.SaveLayoutItemViewModel";

export interface SaveSubLayoutItemViewModel extends SaveLayoutItemViewModel {
  RelationGuid: string;
  SubLayoutGuid: string;
}

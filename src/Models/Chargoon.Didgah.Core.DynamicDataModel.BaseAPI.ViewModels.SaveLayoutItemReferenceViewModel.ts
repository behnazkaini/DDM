import { SaveLayoutItemViewModel } from "./Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.SaveLayoutItemViewModel";

export interface SaveLayoutItemReferenceViewModel extends SaveLayoutItemViewModel {
  RelationGuid: string;
  ColumnGuids: string[];
}

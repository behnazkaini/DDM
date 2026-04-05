import { LayoutItemViewModel } from "./Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.LayoutItemViewModel";

export interface LayoutItemReferenceViewModel extends LayoutItemViewModel {
  RelationGuid: string;
  ColumnGuids: string[];
}

import { LayoutItemViewModel } from "./Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.LayoutItemViewModel";

export interface SubLayoutItemViewModel extends LayoutItemViewModel {
  RelationGuid: string;
  SubLayoutGuid: string;
}

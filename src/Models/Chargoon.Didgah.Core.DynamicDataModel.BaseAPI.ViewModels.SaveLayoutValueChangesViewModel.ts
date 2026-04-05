import { SaveRowViewModel } from "./Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.SaveRowViewModel";

export interface SaveLayoutValueChangesViewModel {
  LayoutGuid: string;
  Rows: SaveRowViewModel[];
}

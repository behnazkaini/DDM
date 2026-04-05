import { LayoutItemViewModel } from "./Chargoon.Didgah.Common5.UI.Models.DynamicDataModel.LayoutItemViewModel";

export interface LayoutViewModel {
  Id: number;
  LayoutKey: string;
  LayoutDesign: string;
  LayoutItems: LayoutItemViewModel[];
}

import { LayoutType } from "./Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.LayoutType";
import { SaveLayoutItemViewModel } from "./Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.SaveLayoutItemViewModel";
import { SaveLayoutPluginViewModel } from "./Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.SaveLayoutPluginViewModel";

export interface ModifyLayoutViewModel {
  Guid: string;
  Type: LayoutType;
  Label: string;
  Design: string;
  IsDefault: boolean;
  Items: SaveLayoutItemViewModel[];
  Plugins: SaveLayoutPluginViewModel[];
}

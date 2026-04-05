import { LayoutType } from "./Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.LayoutType";
import { LayoutPlatformType } from "./Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.LayoutPlatformType";
import { SaveLayoutItemViewModel } from "./Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.SaveLayoutItemViewModel";
import { SaveLayoutPluginViewModel } from "./Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.SaveLayoutPluginViewModel";

export interface AddLayoutViewModel {
  Guid: string;
  DataModelGuid: string;
  Label: string;
  Type: LayoutType;
  PlatformType: LayoutPlatformType;
  Design: string;
  IsDefault: boolean;
  Items: SaveLayoutItemViewModel[];
  Plugins: SaveLayoutPluginViewModel[];
}

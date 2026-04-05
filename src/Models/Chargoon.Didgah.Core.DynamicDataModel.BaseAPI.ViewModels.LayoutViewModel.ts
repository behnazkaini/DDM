import { LayoutType } from "./Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.LayoutType";
import { LayoutPlatformType } from "./Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.LayoutPlatformType";
import { LayoutItemViewModel } from "./Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.LayoutItemViewModel";
import { LayoutPluginViewModel } from "./Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.LayoutPluginViewModel";

export interface LayoutViewModel {
  Guid: string;
  DataModelGuid: string;
  Label: string;
  Type: LayoutType;
  PlatformType: LayoutPlatformType;
  Design: string;
  IsDefault: boolean;
  Items: LayoutItemViewModel[];
  Plugins: LayoutPluginViewModel[];
}

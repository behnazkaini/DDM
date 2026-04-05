import { LayoutType } from "./Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.LayoutType";
import { LayoutPlatformType } from "./Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.LayoutPlatformType";

export interface LayoutBriefViewModel {
  Guid: string;
  DataModelGuid: string;
  Label: string;
  Type: LayoutType;
  PlatformType: LayoutPlatformType;
  IsDefault: boolean;
}

import { LayoutType } from "./Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.LayoutType";
import { LayoutPlatformType } from "./Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.LayoutPlatformType";
import { DataModel } from "./Chargoon.Didgah.Core.DynamicDataModel.Domain.Dtos.DataModel";
import { LayoutItem } from "./Chargoon.Didgah.Core.DynamicDataModel.Domain.Dtos.LayoutItem";

export interface Layout {
  Guid: string;
  Label: string;
  Type: LayoutType;
  PlatformType: LayoutPlatformType;
  Design: string;
  IsDefault: boolean;
  DataModel: DataModel;
  Items: LayoutItem[];
}

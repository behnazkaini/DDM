import { ValidationType } from "./Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.ValidationType";

export interface ValidationViewModel {
  Guid: string;
  LayoutItemGuid: string;
  Type: ValidationType;
  Setting: string;
}

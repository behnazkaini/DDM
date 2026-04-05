import { LayoutItemType } from "./Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.LayoutItemType";

export interface SaveLayoutItemViewModel {
  Guid: string;
  ParentGuid: string;
  Type: LayoutItemType;
  Design: string;
  OrderIndex: number;
}

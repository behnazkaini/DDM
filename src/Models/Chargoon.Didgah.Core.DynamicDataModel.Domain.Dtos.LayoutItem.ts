import { LayoutItemType } from "./Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.LayoutItemType";

export class LayoutItem {
  Guid: string;
  ParentGuid: string;
  Type: LayoutItemType;
  Design: string;
  OrderIndex: number;
}

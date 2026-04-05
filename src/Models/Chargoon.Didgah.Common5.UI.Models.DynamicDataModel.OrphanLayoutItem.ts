import { Widget } from "./Chargoon.Didgah.Common5.UI.Models.DynamicDataModel.Widget";

export interface OrphanLayoutItem {
  DisplayWidgets: Widget[];
  EditeWidgets: Widget[];
  SoftwareGuid: string;
  Title: string;
  TypeGuid: string;
  FieldName: string;
}

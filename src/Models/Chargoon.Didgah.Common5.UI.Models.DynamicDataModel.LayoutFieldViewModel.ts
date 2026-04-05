import { FieldTypeViewModel } from "./Chargoon.Didgah.Common5.UI.Models.DynamicDataModel.FieldTypeViewModel";
import { Widget } from "./Chargoon.Didgah.Common5.UI.Models.DynamicDataModel.Widget";

export interface LayoutFieldViewModel {
  FieldInstanceId: string;
  Name: string;
  Label: string;
  Type: FieldTypeViewModel;
  Settings: string;
  EditWidgets: Widget[];
  DisplayWidgets: Widget[];
  SearchWidgets: Widget[];
  Id: number;
}

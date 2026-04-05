import { DataSourceItemViewModel } from "./Chargoon.Didgah.Common5.UI.Models.Admin.SoftwareSetting.DataSourceItemViewModel";
import { FieldInputType } from "./Chargoon.Library.UI.FieldInputType";

export class SoftwareSetting {
  CaptionKey: string;
  CssClass: string;
  DataSource: DataSourceItemViewModel[];
  Hidden: boolean;
  InputType: FieldInputType;
  Key: string;
  Value: string;
  Description: string;
  ExtendedInfo: Object;
  PopupValue: { [key: string]: string; };
}

import { MyDidgahSoftwareWidgetViewModel } from "./Chargoon.Didgah.Common5.UI.Models.MyDidgah.MyDidgahSoftwareWidgetViewModel";

export interface MyDidgahSoftwareCategoryViewModel {
  Guid: string;
  SoftwareGuid: string;
  Title: string;
  Widgets: MyDidgahSoftwareWidgetViewModel[];
}

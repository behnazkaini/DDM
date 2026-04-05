import { MyDidgahWidgetAddViewModel } from "./Chargoon.Didgah.Common5.UI.Models.MyDidgah.MyDidgahWidgetAddViewModel";
import { MyDidgahWidgetUpdateViewModel } from "./Chargoon.Didgah.Common5.UI.Models.MyDidgah.MyDidgahWidgetUpdateViewModel";

export interface MyDidgahWidgetSaveViewModel {
  DashboardGuid: string;
  Design: string;
  Added: MyDidgahWidgetAddViewModel[];
  Edited: MyDidgahWidgetUpdateViewModel[];
  Deleted: string[];
}

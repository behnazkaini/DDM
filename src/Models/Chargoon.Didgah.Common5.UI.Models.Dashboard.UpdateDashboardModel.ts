import { AddDashboardItemModel } from "./Chargoon.Didgah.Common5.UI.Models.Dashboard.AddDashboardItemModel";

export interface UpdateDashboardModel {
  DashboardGuid: string;
  Structure: string;
  Added: AddDashboardItemModel;
  Deleted: string;
}

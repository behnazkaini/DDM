import { DashboardItemViewModel } from "./Chargoon.Didgah.Common5.UI.Models.Dashboard.DashboardItemViewModel";

export interface DashboardViewModel {
  Guid: string;
  Structure: string;
  Title: string;
  Items: DashboardItemViewModel[];
}

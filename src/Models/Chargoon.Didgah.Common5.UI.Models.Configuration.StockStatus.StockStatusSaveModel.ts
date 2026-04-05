import { StockStatusViewModel } from "./Chargoon.Didgah.Common5.UI.Models.Configuration.StockStatus.StockStatusViewModel";

export interface StockStatusSaveModel {
  Added: StockStatusViewModel[];
  Edited: StockStatusViewModel[];
  Deleted: StockStatusViewModel[];
}

import { OrphanLayoutItem } from "./Chargoon.Didgah.Common5.UI.Models.DynamicDataModel.OrphanLayoutItem";
import { OrphanDataRow } from "./Chargoon.Didgah.Common5.UI.Models.DynamicDataModel.OrphanDataRow";

export interface OrphanDataEntryViewModel {
  OrphanId: number;
  Layoutid: number;
  LayoutItems: OrphanLayoutItem[];
  orphanData: OrphanDataRow[];
}

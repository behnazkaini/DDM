import { OrphanDataCell } from "./Chargoon.Didgah.Common5.UI.Models.DynamicDataModel.OrphanDataCell";

export interface OrphanDataRow {
  Guid: string;
  ParentGuid: string;
  KeyValues: OrphanDataCell[];
}

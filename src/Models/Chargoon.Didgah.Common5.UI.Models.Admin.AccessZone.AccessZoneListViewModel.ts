import { IPagedResponse } from "./Chargoon.Didgah.Core5.Components.Models.TableEx.IPagedResponse";
import { AccessZoneViewModel } from "./Chargoon.Didgah.Common5.UI.Models.Admin.AccessZone.AccessZoneViewModel";

export interface AccessZoneListViewModel {
  Data: AccessZoneViewModel[];
  Total: number;
}

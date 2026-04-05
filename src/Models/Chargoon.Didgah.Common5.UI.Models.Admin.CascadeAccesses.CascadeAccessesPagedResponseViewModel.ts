import { IPagedResponse } from "./Chargoon.Didgah.Core5.Components.Models.TableEx.IPagedResponse";
import { CascadeAccessesResponseViewModel } from "./Chargoon.Didgah.Common5.UI.Models.Admin.CascadeAccesses.CascadeAccessesResponseViewModel";

export interface CascadeAccessesPagedResponseViewModel {
  Data: CascadeAccessesResponseViewModel[];
  Total: number;
}

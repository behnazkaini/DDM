import { IPagedResponse } from "./Chargoon.Didgah.Core5.Components.Models.TableEx.IPagedResponse";
import { FrozenObjectViewModel } from "./Chargoon.Didgah.Common5.UI.Models.Frozen.FrozenObjectViewModel";

export interface FrozenObjectSearchResponsePagedViewModel {
  Data: FrozenObjectViewModel[];
  Total: number;
}

import { IPagedResponse } from "./Chargoon.Didgah.Core5.Components.Models.TableEx.IPagedResponse";
import { EventPatternLoadViewModel } from "./Chargoon.Didgah.Common5.UI.Models.DidgahMessenger.EventPatternLoadViewModel";

export interface EventPatternPagedViewModel {
  Data: EventPatternLoadViewModel[];
  Total: number;
}

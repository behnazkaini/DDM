import { IPagedResponse } from "./Chargoon.Didgah.Core5.Components.Models.TableEx.IPagedResponse";
import { CrashedProcessDetailViewModel } from "./Chargoon.Didgah.Common5.UI.Models.RequestMonitoring.CrashedProcessDetailViewModel";

export interface CrashedProcessesViewModel {
  Data: CrashedProcessDetailViewModel[];
  Total: number;
}

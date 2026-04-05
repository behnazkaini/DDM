import { IPagedResponse } from "./Chargoon.Didgah.Core5.Components.Models.TableEx.IPagedResponse";
import { BackgroundTaskViewModel } from "./Chargoon.Didgah.Common5.UI.Models.Admin.BackgroundTask.BackgroundTaskViewModel";

export interface BackgroundTaskListPagedResponseViewModel {
  Data: BackgroundTaskViewModel[];
  Total: number;
}

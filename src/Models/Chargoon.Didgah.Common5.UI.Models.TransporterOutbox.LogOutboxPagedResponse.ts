import { IPagedResponse } from "./Chargoon.Didgah.Core5.Components.Models.TableEx.IPagedResponse";
import { LogOutboxViewModel } from "./Chargoon.Didgah.Common5.UI.Models.TransporterOutbox.LogOutboxViewModel";

export interface LogOutboxPagedResponse {
  Data: LogOutboxViewModel[];
  Total: number;
}

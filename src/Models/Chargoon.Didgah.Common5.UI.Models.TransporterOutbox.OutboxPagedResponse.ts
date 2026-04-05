import { IPagedResponse } from "./Chargoon.Didgah.Core5.Components.Models.TableEx.IPagedResponse";
import { OutboxViewModel } from "./Chargoon.Didgah.Common5.UI.Models.TransporterOutbox.OutboxViewModel";

export interface OutboxPagedResponse {
  Data: OutboxViewModel[];
  Total: number;
}

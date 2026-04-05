import { IPagedResponse } from "./Chargoon.Didgah.Core5.Components.Models.TableEx.IPagedResponse";
import { TransporterInboxItemViewModel } from "./Chargoon.Didgah.Common5.UI.Models.Admin.Transporter.TransporterInboxItemViewModel";

export interface TransporterInboxListPagedResponseViewModel {
  Data: TransporterInboxItemViewModel[];
  Total: number;
}

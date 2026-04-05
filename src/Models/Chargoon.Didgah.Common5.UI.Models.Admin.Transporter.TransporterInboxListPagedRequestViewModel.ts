import { IPagedRequest } from "./Chargoon.Didgah.Core5.Components.Models.TableEx.IPagedRequest";
import { TransporterInboxFilterViewModel } from "./Chargoon.Didgah.Common5.UI.Models.Admin.Transporter.TransporterInboxFilterViewModel";
import { SortOrder } from "./Chargoon.Didgah.Core5.Components.Models.Common.SortOrder";

export interface TransporterInboxListPagedRequestViewModel {
  PageSize: number;
  PageIndex: number;
  Metadata: TransporterInboxFilterViewModel;
  SortField: string;
  SortOrder: SortOrder;
}

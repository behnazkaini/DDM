import { IPagedRequest } from "./Chargoon.Didgah.Core5.Components.Models.TableEx.IPagedRequest";
import { OutboxFilterModel } from "./Chargoon.Didgah.Common5.UI.Models.TransporterOutbox.OutboxFilterModel";
import { SortOrder } from "./Chargoon.Didgah.Core5.Components.Models.Common.SortOrder";

export interface OutboxFilterModelRequest {
  Metadata: OutboxFilterModel;
  PageIndex: number;
  PageSize: number;
  SortField: string;
  SortOrder: SortOrder;
}

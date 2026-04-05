import { IPagedRequest } from "./Chargoon.Didgah.Core5.Components.Models.TableEx.IPagedRequest";
import { LogOutboxFilterModel } from "./Chargoon.Didgah.Common5.UI.Models.TransporterOutbox.LogOutboxFilterModel";
import { SortOrder } from "./Chargoon.Didgah.Core5.Components.Models.Common.SortOrder";

export interface LogOutboxFilterModelRequest {
  Metadata: LogOutboxFilterModel;
  PageIndex: number;
  PageSize: number;
  SortField: string;
  SortOrder: SortOrder;
}

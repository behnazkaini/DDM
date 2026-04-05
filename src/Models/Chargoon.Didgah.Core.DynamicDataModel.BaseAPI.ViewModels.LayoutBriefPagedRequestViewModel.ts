import { IPagedRequest } from "./Chargoon.Didgah.Core5.Components.Models.TableEx.IPagedRequest";
import { LayoutBriefPagedFilterViewModel } from "./Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.LayoutBriefPagedFilterViewModel";
import { SortOrder } from "./Chargoon.Didgah.Core5.Components.Models.Common.SortOrder";

export interface LayoutBriefPagedRequestViewModel {
  PageSize: number;
  PageIndex: number;
  SortField: string;
  SortOrder: SortOrder;
  Metadata: LayoutBriefPagedFilterViewModel;
}

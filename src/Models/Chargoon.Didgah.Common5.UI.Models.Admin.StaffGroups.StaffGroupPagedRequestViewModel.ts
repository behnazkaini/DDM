import { IPagedRequest } from "./Chargoon.Didgah.Core5.Components.Models.TableEx.IPagedRequest";
import { StaffGroupPagedRequestMetadataViewModel } from "./Chargoon.Didgah.Common5.UI.Models.Admin.StaffGroups.StaffGroupPagedRequestMetadataViewModel";
import { SortOrder } from "./Chargoon.Didgah.Core5.Components.Models.Common.SortOrder";

export interface StaffGroupPagedRequestViewModel {
  PageSize: number;
  PageIndex: number;
  Metadata: StaffGroupPagedRequestMetadataViewModel;
  SortField: string;
  SortOrder: SortOrder;
}

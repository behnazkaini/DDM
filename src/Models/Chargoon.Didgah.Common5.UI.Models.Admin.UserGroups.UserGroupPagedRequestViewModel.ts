import { IPagedRequest } from "./Chargoon.Didgah.Core5.Components.Models.TableEx.IPagedRequest";
import { UserGroupPagedRequestMetadataViewModel } from "./Chargoon.Didgah.Common5.UI.Models.Admin.UserGroups.UserGroupPagedRequestMetadataViewModel";
import { SortOrder } from "./Chargoon.Didgah.Core5.Components.Models.Common.SortOrder";

export interface UserGroupPagedRequestViewModel {
  PageSize: number;
  PageIndex: number;
  Metadata: UserGroupPagedRequestMetadataViewModel;
  SortField: string;
  SortOrder: SortOrder;
}

import { IPagedResponse } from "./Chargoon.Didgah.Core5.Components.Models.TableEx.IPagedResponse";
import { UserGroupViewModel } from "./Chargoon.Didgah.Common5.UI.Models.Admin.UserGroups.UserGroupViewModel";

export interface UserGroupPagedResponseViewModel {
  Data: UserGroupViewModel[];
  Total: number;
}

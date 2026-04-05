import { UserGroupFlag } from "./Chargoon.Didgah.Common.Domain.Enumeration.UserGroupFlag";
import { UserGroupViewModel } from "./Chargoon.Didgah.Common5.UI.Models.Admin.UserGroups.UserGroupViewModel";

export interface UserGroupSaveViewModel {
  Flag: UserGroupFlag;
  TempObjectGuid: string;
  UserGroup: UserGroupViewModel;
}

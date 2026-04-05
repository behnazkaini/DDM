import { UserGroupMemberViewModel } from "./Chargoon.Didgah.Common5.UI.Models.Admin.UserGroups.UserGroupMemberViewModel";
import { UserGroupFlag } from "./Chargoon.Didgah.Common.Domain.Enumeration.UserGroupFlag";

export interface UserGroupMemberEditViewModel {
  UserGroupGuid: string;
  TempObjectGuid: string;
  Members: UserGroupMemberViewModel[];
  Flag: UserGroupFlag;
  SelectAllUsers: boolean;
}

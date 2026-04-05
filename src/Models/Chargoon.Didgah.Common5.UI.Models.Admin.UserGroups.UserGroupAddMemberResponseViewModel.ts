import { UserGroupMemberViewModel } from "./Chargoon.Didgah.Common5.UI.Models.Admin.UserGroups.UserGroupMemberViewModel";

export interface UserGroupAddMemberResponseViewModel {
  Members: UserGroupMemberViewModel[];
  Duplicates: UserGroupMemberViewModel[];
  TotalCount: number;
}

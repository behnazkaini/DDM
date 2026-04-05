import { PermissionGroupMemberItem } from "./Chargoon.Didgah.Common5.UI.Models.Admin.PermissionGroup.PermissionGroupMemberItem";

export interface PermissionGroupGetMembersResponseViewModel {
  Members: PermissionGroupMemberItem[];
  GroupCount: number;
  MemberCount: number;
}

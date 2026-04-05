import { PermissionGroupType } from "./Chargoon.Didgah.Common.Domain.Enumeration.PermissionGroupType";
import { PermissionGroupMemberItem } from "./Chargoon.Didgah.Common5.UI.Models.Admin.PermissionGroup.PermissionGroupMemberItem";

export interface PermissionGroupEditMembersRequestViewModel {
  TempObjectID: string;
  GroupGuid: string;
  AccessZoneGuid: string;
  PermissionGroupType: PermissionGroupType;
  Members: PermissionGroupMemberItem[];
  SelectAllMembers: boolean;
  IsNewGroup: boolean;
}

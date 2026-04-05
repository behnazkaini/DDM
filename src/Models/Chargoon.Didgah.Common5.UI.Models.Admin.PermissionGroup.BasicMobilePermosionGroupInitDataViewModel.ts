import { PermissionGroupType } from "./Chargoon.Didgah.Common.Domain.Enumeration.PermissionGroupType";
import { PermissionGroupMembershipType } from "./Chargoon.Didgah.Common.Domain.Enumeration.PermissionGroupMembershipType";
import { AccessViewModel } from "./Chargoon.Didgah.Common5.UI.Models.Admin.PermissionGroup.AccessViewModel";

export interface BasicMobilePermosionGroupInitDataViewModel {
  EnableDigitalSignature: boolean;
  Guid: string;
  TempObjectID: string;
  PermissionGroupType: PermissionGroupType;
  MembershipType: PermissionGroupMembershipType;
  AccessZoneGuid: string;
  Description: string;
  IsActive: boolean;
  IsNewGroup: boolean;
  Access: AccessViewModel;
  MemberCount: number;
}

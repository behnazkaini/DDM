import { GuidTitlePair } from "./Chargoon.Didgah.Common5.UI.Models.Admin.GuidTitlePair";
import { GenericKeyValuePair } from "./Chargoon.Didgah.Common5.UI.Models.Admin.GenericKeyValuePair";
import { PermissionGroupMembershipType } from "./Chargoon.Didgah.Common.Domain.Enumeration.PermissionGroupMembershipType";

export interface PermissionGroupEditInitDataResponseViewModel {
  Guid: string;
  TempObjectID: string;
  AccessZone: GuidTitlePair;
  IsAccessZoneEditable: boolean;
  SoftwearList: GenericKeyValuePair<string>[];
  SoftwareGuid: string;
  IsSoftwareGuidEditable: boolean;
  Title: string;
  Description: string;
  GroupMembersCount: number;
  MembersCount: number;
  IsActive: boolean;
  MembershipType: PermissionGroupMembershipType;
  AllowAddGroup: boolean;
  AllowAddMemeber: boolean;
  IsGroupInfoReadOnly: boolean;
  IsNewGroup: boolean;
  EnableDigitalSignature: boolean;
}

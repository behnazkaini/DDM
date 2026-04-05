import { PermissionGroupType } from "./Chargoon.Didgah.Common.Domain.Enumeration.PermissionGroupType";
import { PermissionGroupMembershipType } from "./Chargoon.Didgah.Common.Domain.Enumeration.PermissionGroupMembershipType";
import { SignedContentViewModel } from "./Chargoon.Didgah.Common5.UI.Models.DigitalSignature.SignedContentViewModel";

export interface PermissionGroupInfoSaveRequestViewModel {
  Guid: string;
  TempObjectID: string;
  PermissionGroupType: PermissionGroupType;
  MembershipType: PermissionGroupMembershipType;
  AccessZoneGuid: string;
  SoftwareGuid: string;
  Title: string;
  Description: string;
  IsActive: boolean;
  IsNewGroup: boolean;
  SignedContentList: SignedContentViewModel[];
}

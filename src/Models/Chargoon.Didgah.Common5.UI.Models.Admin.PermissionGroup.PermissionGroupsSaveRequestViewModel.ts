import { SignedContentViewModel } from "./Chargoon.Didgah.Common5.UI.Models.DigitalSignature.SignedContentViewModel";
import { PermissionGroupType } from "./Chargoon.Didgah.Common.Domain.Enumeration.PermissionGroupType";

export interface PermissionGroupsSaveRequestViewModel {
  MemberGuid: string;
  NewPermissionGroups: string[];
  DeletedPermissionGroups: string[];
  SignedContentList: SignedContentViewModel[];
  PermissionGroupType: PermissionGroupType;
}

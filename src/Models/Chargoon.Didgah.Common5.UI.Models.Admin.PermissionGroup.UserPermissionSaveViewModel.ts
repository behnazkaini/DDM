import { PermissionAccessorTypes } from "./Chargoon.Didgah.Security.PermissionAccessorTypes";
import { AccessSaveViewModel } from "./Chargoon.Didgah.Common5.UI.Models.Admin.PermissionGroup.AccessSaveViewModel";
import { SignedContentViewModel } from "./Chargoon.Didgah.Common5.UI.Models.DigitalSignature.SignedContentViewModel";

export interface UserPermissionSaveViewModel {
  AccessorGuid: string;
  AccessorType: PermissionAccessorTypes;
  UserAccess: AccessSaveViewModel[];
  AccessManagementOfSoftwareAccess: AccessSaveViewModel[];
  AccessToUseSoftware: AccessSaveViewModel[];
  SignedContentList: SignedContentViewModel[];
}

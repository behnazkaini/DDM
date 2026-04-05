import { AccessViewModel } from "./Chargoon.Didgah.Common5.UI.Models.Admin.PermissionGroup.AccessViewModel";

export interface UserPermissionViewModel {
  UserAccess: AccessViewModel[];
  AccessManagementOfSoftwareAccess: AccessViewModel[];
  AccessToUseSoftware: AccessViewModel[];
  EnableDigitalSignature: boolean;
}

import { PermissionAccessorTypes } from "./Chargoon.Didgah.Security.PermissionAccessorTypes";
import { SignedContentViewModel } from "./Chargoon.Didgah.Common5.UI.Models.DigitalSignature.SignedContentViewModel";

export interface StaffAccessCodeSignedContentRequestViewModel {
  AccessorGuid: string;
  AccessorType: PermissionAccessorTypes;
  SignedContentList: SignedContentViewModel[];
}

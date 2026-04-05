import { PermissionGroupType } from "./Chargoon.Didgah.Common.Domain.Enumeration.PermissionGroupType";
import { SignedContentViewModel } from "./Chargoon.Didgah.Common5.UI.Models.DigitalSignature.SignedContentViewModel";

export interface PermissionGroupDeleteRequestViewModel {
  Guid: string;
  PermissionGroupType: PermissionGroupType;
  SignedContentList: SignedContentViewModel[];
}

import { UserStatus } from "./Chargoon.Didgah.Common5.UI.Models.Admin.Users.UserArchive.UserStatus";
import { MobileSoftwareValueViewModel } from "./Chargoon.Didgah.Common5.UI.Models.Admin.Users.UserArchive.MobileSoftwareValueViewModel";

export interface UserFilterViewModel {
  UserName: string;
  FullName: string;
  UserStatus: UserStatus;
  IsTwoFactorAuthentication: boolean;
  IsActivityLimited: boolean;
  AccessZoneID: number;
  MobileSoftware: MobileSoftwareValueViewModel;
  OperationServerGuid: string;
  onlySearchInExternalUsers: boolean;
}

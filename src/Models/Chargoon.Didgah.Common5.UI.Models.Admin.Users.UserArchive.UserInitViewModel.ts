import { GenericKeyValuePair } from "./Chargoon.Didgah.Common5.UI.Models.Admin.GenericKeyValuePair";
import { MobileSoftwareValueViewModel } from "./Chargoon.Didgah.Common5.UI.Models.Admin.Users.UserArchive.MobileSoftwareValueViewModel";
import { UserAccessZoneViewModel } from "./Chargoon.Didgah.Common5.UI.Models.Admin.AccessZone.UserAccessZoneViewModel";

export interface UserInitViewModel {
  IsMobileApiAvailable: boolean;
  IsStateServerAvailable: boolean;
  HasAccessForUserSessionManagement: boolean;
  IsTwoFactorAuthenticationAvailable: boolean;
  IsSyncServerAvailable: boolean;
  IsOperationUnitEditAvailable: boolean;
  IsAllUsersBanned: boolean;
  IsPermissionDigitalSignatureEnabled: boolean;
  IsAssignUserPermissionGroupsAccessEnabled: boolean;
  IsSmsButtonVisible: boolean;
  MobileSoftwares: GenericKeyValuePair<MobileSoftwareValueViewModel>[];
  OperationServers: GenericKeyValuePair<string>[];
  HasChangeUserPermissionAccess: boolean;
  HasDefineUserAccess: boolean;
  IsPkiLicenseAvailable: boolean;
  HasDefineOtherUserSignatureAccess: boolean;
  HasAccessSmsAlertSettings: boolean;
  HasAccessEmailAlertSettings: boolean;
  HasUserPermissionGroupsAccess: boolean;
  HasUserSessionsManagement: boolean;
  OperationGuid: string;
  IsViewStatisticsAvailable: boolean;
  UserAccessZone: UserAccessZoneViewModel;
  ShowEmailClient: boolean;
  EmailToken: string;
  UserPolicies:string
  LogApiIsActive:boolean
}

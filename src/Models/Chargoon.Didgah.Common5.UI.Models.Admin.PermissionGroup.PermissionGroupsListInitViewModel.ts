import { GenericKeyValuePair } from "./Chargoon.Didgah.Common5.UI.Models.Admin.GenericKeyValuePair";
import { PermissionGroupsListDefaultAccessZoneViewModel } from "./Chargoon.Didgah.Common5.UI.Models.Admin.PermissionGroup.PermissionGroupsListDefaultAccessZoneViewModel";

export interface PermissionGroupsListInitViewModel {
  SoftwearList: GenericKeyValuePair<string>[];
  EnableDigitalSignature: boolean;
  DisableAccessZone: boolean;
  AccessZone: PermissionGroupsListDefaultAccessZoneViewModel;
}

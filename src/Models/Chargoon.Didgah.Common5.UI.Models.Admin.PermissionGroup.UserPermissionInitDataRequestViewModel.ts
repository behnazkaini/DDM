import { PermissionAccessorTypes } from "./Chargoon.Didgah.Security.PermissionAccessorTypes";

export interface UserPermissionInitDataRequestViewModel {
  AccessorGuid: string;
  AccessorType: PermissionAccessorTypes;
}

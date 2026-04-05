import { PermissionAccessorTypes } from "./Chargoon.Didgah.Security.PermissionAccessorTypes";

export interface StaffPermissionInitDataRequestViewModel {
  AccessorGuid: string;
  AccessorType: PermissionAccessorTypes;
  SoftwareGuid: string;
}

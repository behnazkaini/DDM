import { PermissionAccessorTypes } from "./Chargoon.Didgah.Security.PermissionAccessorTypes";

export interface StaffPermissionAceessCodesFilterViewModel {
  AccessorGuid: string;
  AccessorType: PermissionAccessorTypes;
  SoftwareGuid: string;
  CategoryGuid: string;
  RoleObject: number;
}

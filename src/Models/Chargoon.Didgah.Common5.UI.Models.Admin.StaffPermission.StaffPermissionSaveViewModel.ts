import { PermissionAccessorTypes } from "./Chargoon.Didgah.Security.PermissionAccessorTypes";
import { StaffAccessCodeViewModel } from "./Chargoon.Didgah.Common5.UI.Models.Admin.StaffPermission.StaffAccessCodeViewModel";

export interface StaffPermissionSaveViewModel {
  AccessorGuid: string;
  AccessorType: PermissionAccessorTypes;
  SoftwareGuid: string;
  CategoryGuid: string;
  RoleObject: number;
  StaffAccessCodeViewModels: StaffAccessCodeViewModel[];
}

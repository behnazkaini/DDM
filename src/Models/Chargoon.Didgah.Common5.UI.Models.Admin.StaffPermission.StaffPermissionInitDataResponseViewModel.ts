import { StaffAccessCodeViewModel } from "./Chargoon.Didgah.Common5.UI.Models.Admin.StaffPermission.StaffAccessCodeViewModel";
import { PermissionCategoryViewModel } from "./Chargoon.Didgah.Common5.UI.Models.Admin.StaffPermission.PermissionCategoryViewModel";

export interface StaffPermissionInitDataResponseViewModel {
  StaffAccessCodeViewModels: StaffAccessCodeViewModel[];
  HasCategory: boolean;
  PermissionCategory: PermissionCategoryViewModel;
  HasRoleObject: boolean;
  EnableDigitalSignature: boolean;
}

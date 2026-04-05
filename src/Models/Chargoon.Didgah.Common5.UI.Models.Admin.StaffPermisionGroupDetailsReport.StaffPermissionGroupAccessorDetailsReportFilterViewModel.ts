import { StaffAccessCodeViewModel } from "./Chargoon.Didgah.Common5.UI.Models.Admin.StaffPermission.StaffAccessCodeViewModel";

export interface StaffPermissionGroupAccessorDetailsReportFilterViewModel {
  PermissionGroupGuid: string;
  DateFrom: Date;
  DateTo: Date;
  Destination: string;
  Output: string;
  SoftwareGuid: string;
  CategoryGuid: string;
  RoleObject: number;
  StaffAccessCodeViewModels: StaffAccessCodeViewModel[];
}

import { StaffAccessCodeViewModel } from "./Chargoon.Didgah.Common5.UI.Models.Admin.StaffPermission.StaffAccessCodeViewModel";

export interface StaffAccessorReportFilterViewModel {
  StaffGuid: string;
  SoftwareGuid: string;
  DateFrom: Date;
  DateTo: Date;
  CategoryGuid: string;
  RoleObject: number;
  StaffAccessCodeViewModels: StaffAccessCodeViewModel[];
  Output: string;
  Destination: string;
}

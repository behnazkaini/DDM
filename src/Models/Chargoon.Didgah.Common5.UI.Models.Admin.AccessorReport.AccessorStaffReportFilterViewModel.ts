import { AccessFilterOperationType } from "./Chargoon.Didgah.Common5.UI.Models.Admin.AccessorReport.AccessFilterOperationType";
import { StaffAccessCodeViewModel } from "./Chargoon.Didgah.Common5.UI.Models.Admin.StaffPermission.StaffAccessCodeViewModel";

export interface AccessorStaffReportFilterViewModel {
  Operation: AccessFilterOperationType;
  SecretarialID: number;
  DepartmentID: number;
  OperationServerGuid: string;
  WorkSectionID: number;
  SoftwareGuid: string;
  CategoryGuid: string;
  RoleObject: number;
  StaffAccessCodeViewModels: StaffAccessCodeViewModel[];
  Output: string;
  Destination: string;
}

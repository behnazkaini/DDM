import { AccessFilterOperationType } from "./Chargoon.Didgah.Common5.UI.Models.Admin.AccessorReport.AccessFilterOperationType";
import { AccessSaveViewModel } from "./Chargoon.Didgah.Common5.UI.Models.Admin.PermissionGroup.AccessSaveViewModel";

export interface AccessorUserReportFilterViewModel {
  Operation: AccessFilterOperationType;
  AccessZoneGuid: string;
  OperationServerGuid: string;
  UserAccess: AccessSaveViewModel[];
  AccessManagementOfSoftwareAccess: AccessSaveViewModel[];
  Output: string;
  Destination: string;
}

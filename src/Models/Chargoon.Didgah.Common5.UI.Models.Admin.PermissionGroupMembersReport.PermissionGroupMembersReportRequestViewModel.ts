import { PermissionGroupMembersReportType } from "./Chargoon.Didgah.Common5.UI.Models.Admin.PermissionGroupMembersReport.PermissionGroupMembersReportType";
import { PermissionGroupMembersReportLogicalOperatorType } from "./Chargoon.Didgah.Common5.UI.Models.Admin.PermissionGroupMembersReport.PermissionGroupMembersReportLogicalOperatorType";

export interface PermissionGroupMembersReportRequestViewModel {
  PermissionGroupGuids: string[];
  WithoutPermissionGroup: boolean;
  Type: PermissionGroupMembersReportType;
  LogicalOperator: PermissionGroupMembersReportLogicalOperatorType;
  Destination: string;
  Output: string;
}

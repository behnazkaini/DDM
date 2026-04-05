import { StaffPermissionAccessCodeResponseViewModel } from "./Chargoon.Didgah.Common5.UI.Models.Admin.StaffPermission.StaffPermissionAccessCodeResponseViewModel";
import { PermissionModificationInfoViewModel } from "./Chargoon.Didgah.Common5.UI.Models.Admin.PermissionsHistoryReport.PermissionModificationInfoViewModel";

export interface StaffPermissionHistoryReportResultViewModel {
  PermissionHistory: StaffPermissionAccessCodeResponseViewModel;
  LastModifiecationsDetails: PermissionModificationInfoViewModel[];
}

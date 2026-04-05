import { StaffPermissionInitDataResponseViewModel } from "./Chargoon.Didgah.Common5.UI.Models.Admin.StaffPermission.StaffPermissionInitDataResponseViewModel";
import { PermissionModificationInfoViewModel } from "./Chargoon.Didgah.Common5.UI.Models.Admin.PermissionsHistoryReport.PermissionModificationInfoViewModel";

export interface StaffPermissionHistoryReportInitDataResultViewModel {
  PermissionHistoryInitData: StaffPermissionInitDataResponseViewModel;
  LastModifiecationsDetails: PermissionModificationInfoViewModel[];
}

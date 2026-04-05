import { AccessViewModel } from "./Chargoon.Didgah.Common5.UI.Models.Admin.PermissionGroup.AccessViewModel";
import { PermissionModificationInfoViewModel } from "./Chargoon.Didgah.Common5.UI.Models.Admin.PermissionsHistoryReport.PermissionModificationInfoViewModel";

export interface UserPermissionHistoryReportResultViewModel {
  UserAccess: AccessViewModel[];
  AccessManagementOfSoftwareAccess: AccessViewModel[];
  AccessToUseSoftware: AccessViewModel[];
  LastModifiecationsDetails: PermissionModificationInfoViewModel[];
  EnableDigitalSignature: boolean;
}

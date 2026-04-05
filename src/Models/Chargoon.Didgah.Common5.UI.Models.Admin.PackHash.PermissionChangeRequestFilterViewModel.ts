import { PermissionScanType } from "./Chargoon.Didgah.PackHash.Domain.Enumerations.PermissionScanType";
import { PermissionChangeType } from "./Chargoon.Didgah.PackHash.Domain.Enumerations.PermissionChangeType";

export interface PermissionChangeRequestFilterViewModel {
  Path: string;
  UserIdentity: string;
  DateFrom: Date;
  DateTo: Date;
  ScanType: PermissionScanType;
  ExpectedPermission: string;
  CurrentPermission: string;
  PermissionChangeType: PermissionChangeType;
  Description: string;
  HostName: string;
}

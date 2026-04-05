import { PermissionScanType } from "./Chargoon.Didgah.PackHash.Domain.Enumerations.PermissionScanType";
import { PermissionChangeType } from "./Chargoon.Didgah.PackHash.Domain.Enumerations.PermissionChangeType";

export interface PermissionChangeResponseViewModel {
  Id: number;
  Path: string;
  UserIdentity: string;
  CreationTime: Date;
  ScanType: PermissionScanType;
  ExpectedPermission: string;
  CurrentPermission: string;
  PermissionChangeType: PermissionChangeType;
  Description: string;
  HostName: string;
}

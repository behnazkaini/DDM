import { PermissionGroupType } from "./Chargoon.Didgah.Common.Domain.Enumeration.PermissionGroupType";

export interface PermissionGroupCopyRequestViewModel {
  PermissionGroupType: PermissionGroupType;
  SourceGroupGuid: string;
  TargetAccessZoneGuid: string;
  TargetSoftwareGuid: string;
  CopyAccessCodes: boolean;
}

import { PermissionGroupType } from "./Chargoon.Didgah.Common.Domain.Enumeration.PermissionGroupType";

export interface PermissionGroupCheckAccessZoneAccessRequestViewModel {
  GroupGuid: string;
  AccessZoneGuid: string;
  SoftwareGuid: string;
  PermissionGroupType: PermissionGroupType;
}

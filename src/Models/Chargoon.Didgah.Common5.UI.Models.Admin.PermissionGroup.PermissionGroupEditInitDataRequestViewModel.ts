import { PermissionGroupType } from "./Chargoon.Didgah.Common.Domain.Enumeration.PermissionGroupType";

export interface PermissionGroupEditInitDataRequestViewModel {
  PermissionGroupGuid: string;
  PermissionGroupType: PermissionGroupType;
}

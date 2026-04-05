import { PermissionGroupType } from "./Chargoon.Didgah.Common.Domain.Enumeration.PermissionGroupType";

export interface PermissionGroupsSignRequestViewModel {
  MemberGuid: string;
  NewPermissionGroups: string[];
  DeletedPermissionGroups: string[];
  PermissionGroupType: PermissionGroupType;
}

import { PermissionGroupType } from "./Chargoon.Didgah.Common.Domain.Enumeration.PermissionGroupType";

export interface MemberOfPermissionGroupFilterViewModel {
  MemberGuid: string;
  PermissionGroupType: PermissionGroupType;
}

import { PermissionGroupType } from "./Chargoon.Didgah.Common.Domain.Enumeration.PermissionGroupType";

export interface PermissionGroupGetMembersRequestViewModel {
  TempObjectID: string;
  PermissionGroupType: PermissionGroupType;
  SearchKeyword: string;
  PageIndex: number;
  PageSize: number;
}

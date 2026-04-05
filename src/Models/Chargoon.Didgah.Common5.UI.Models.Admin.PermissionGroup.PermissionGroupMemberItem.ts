import { PermissionAccessorTypes } from "./Chargoon.Didgah.Security.PermissionAccessorTypes";

export interface PermissionGroupMemberItem {
  Guid: string;
  Title: string;
  Description: string;
  Type: PermissionAccessorTypes;
  AllowRemove: boolean;
}

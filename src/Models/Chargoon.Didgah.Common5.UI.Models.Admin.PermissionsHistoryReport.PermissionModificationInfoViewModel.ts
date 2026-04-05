import { PermissionModificationType } from "./Chargoon.Didgah.Common.Domain.Enumeration.PermissionModificationType";

export interface PermissionModificationInfoViewModel {
  ID: number;
  UserFullName: string;
  ModificationType: PermissionModificationType;
  ModificationDate: Date;
  ModificationServerGuid: string;
}

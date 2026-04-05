import { StructureTreeNodeType } from "./Chargoon.Didgah.Common5.UI.Models.StructureTreeEx.StructureTreeNodeType";
import { StaffPersonRelationType } from "./Chargoon.Didgah.Common.Domain.Enumeration.StaffPersonRelationType";

export interface StructureTreeNodeMetadata {
  Type: StructureTreeNodeType;
  StaffPersonRelationType: StaffPersonRelationType;
  Flag: number;
  DecryptedGuid: string;
  Guid: string;
  DepartmentId: number;
  HasAutoAssociationResponsible: boolean;
  IsStaffAutoAssociationResponsible: boolean;
  IsExternal: boolean;
}

import { StaffPersonRelationUnassignmentType } from "./Chargoon.Didgah.Common.Domain.Enumeration.StaffPersonRelationUnassignmentType";

export interface UnassignedStaffFilterViewModel {
  StaffPersonRelationType: StaffPersonRelationUnassignmentType;
  AccessZoneId: number;
}

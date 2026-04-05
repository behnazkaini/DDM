import { ErrorType } from "./Chargoon.Didgah.Common.Domain.Enumeration.ErrorType";

export interface PermissionGroupMembersEditResultViewModel {
  ChangedMemberCount: number;
  DuplicatedMemberGuids: string[];
  CircularGroupGuids: string[];
  Errors: ErrorType[];
  MemberCount: number;
  GroupCount: number;
}

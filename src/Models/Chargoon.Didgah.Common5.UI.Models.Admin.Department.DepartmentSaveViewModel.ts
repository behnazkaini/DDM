import { DepartmentDatabaseSaveViewModel } from "./Chargoon.Didgah.Common5.UI.Models.Admin.Department.DepartmentDatabaseSaveViewModel";

export interface DepartmentSaveViewModel {
  Guid: string;
  Id: number;
  AccessZoneId: number;
  OperationGuid: string;
  ParentDeptId: number;
  Code: string;
  Title: string;
  OrderIndex: number;
  ContactInfo: string;
  IsWorkSection: boolean;
  IsFinancialCenter: boolean;
  UseParentAccessZone: boolean;
  IsSecretarial: boolean;
  Comment: string;
  IsLinkServerMode: boolean;
  BureauCode: string;
  SapadPartyId: string;
  IsAccessZoneChanged: boolean;
  IndependentDatabases: boolean;
  AddedDepartmentDatabases: DepartmentDatabaseSaveViewModel[];
  DeletedDepartmentDatabases: DepartmentDatabaseSaveViewModel[];
  EditedDepartmentDatabases: DepartmentDatabaseSaveViewModel[];
}

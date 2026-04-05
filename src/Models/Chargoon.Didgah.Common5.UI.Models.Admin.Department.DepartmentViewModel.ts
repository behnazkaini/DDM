import { DepartmentDatabaseViewModel } from "./Chargoon.Didgah.Common5.UI.Models.Admin.Department.DepartmentDatabaseViewModel";

export interface DepartmentViewModel {
  Guid: string;
  Id: number;
  AccessZoneId: number;
  AccessZoneTitle: string;
  OperationGuid: string;
  ParentDeptId: number;
  Code: string;
  Title: string;
  OrderIndex: number;
  ContactInfo: string;
  IsWorkSection: boolean;
  IsFinancialCenter: boolean;
  IsSecretarial: boolean;
  Comment: string;
  IsLinkServerMode: boolean;
  BureauCode: string;
  UseParentAccessZone: boolean;
  IndependentDatabases: boolean;
  SapadPartyId: string;
  DepartmentDatabases: DepartmentDatabaseViewModel[];
  EmailAccountId: number;
}

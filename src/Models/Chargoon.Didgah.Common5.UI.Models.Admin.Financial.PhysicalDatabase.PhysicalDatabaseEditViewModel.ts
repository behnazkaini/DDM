import { LogicalDatabaseEditViewModel } from "./Chargoon.Didgah.Common5.UI.Models.Admin.Financial.LogicalDatabase.LogicalDatabaseEditViewModel";

export interface PhysicalDatabaseEditViewModel {
  Guid: string;
  Code: number;
  Title: string;
  DatabaseName: string;
  DatabasePrefix: string;
  DatabaseServer: string;
  SoftwareGuid: string;
  OperationGuid: string;
  Username: string;
  Password: string;
  ConnectionTimeout: number;
  QueryTimeout: number;
  DepartmentTitles: string[];
  LogicalDatabases: LogicalDatabaseEditViewModel[];
}

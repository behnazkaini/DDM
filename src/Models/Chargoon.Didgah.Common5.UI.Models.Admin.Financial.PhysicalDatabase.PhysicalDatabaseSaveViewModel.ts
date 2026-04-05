import { LogicalDatabaseSaveViewModel } from "./Chargoon.Didgah.Common5.UI.Models.Admin.Financial.LogicalDatabase.LogicalDatabaseSaveViewModel";

export interface PhysicalDatabaseSaveViewModel {
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
  IsNew: boolean;
  UpdatePassword: boolean;
  AddedLogicalDatabases: LogicalDatabaseSaveViewModel[];
  EditedLogicalDatabases: LogicalDatabaseSaveViewModel[];
  DeletedLogicalDatabases: LogicalDatabaseSaveViewModel[];
}

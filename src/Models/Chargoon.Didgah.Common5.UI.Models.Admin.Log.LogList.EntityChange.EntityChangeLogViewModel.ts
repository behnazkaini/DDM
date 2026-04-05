import { LogBase } from "./Chargoon.Didgah.Common5.UI.Models.Admin.Log.LogList.LogBase";

export interface EntityChangeLogViewModel extends LogBase {
  TransactionGuid: string;
  EntityGuid: string;
  DatabaseGuid: string;
  EntityName: string;
  FieldName: string;
  OldValue: string;
  NewValue: string;
  PrimaryKeyValue: string;
}

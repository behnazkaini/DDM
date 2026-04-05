import { ParameterType } from "./Chargoon.Reporting.ParameterType";
import { Operator } from "./Chargoon.Reporting.Operator";
import { ParameterDataEntryInfo } from "./Chargoon.Didgah.Common5.UI.Models.Reporting.ParameterDataEntryInfo";

export class ReportParameterInfo {
  Type: ParameterType;
  TableName: string;
  FieldName: string;
  Operator: Operator;
  Operand1: string;
  Operand2: string;
  Operand1Display: string;
  Operand2Display: string;
  TableDisplayName: string;
  FieldDisplayName: string;
  DataEntryInfo: ParameterDataEntryInfo;
  Required: boolean;
  SessionKey: string;
  WorkspaceKey: string;
  FixedSessionKey: string;
  FixedWorkspaceKey: string;
}

import { GenericKeyValuePair } from "./Chargoon.Didgah.Common5.UI.Models.Admin.GenericKeyValuePair";
import { AccessorReportOperationServer } from "./Chargoon.Didgah.Common5.UI.Models.Admin.AccessorReport.AccessorReportOperationServer";

export interface AccessorReportInitDataResponseViewModel {
  IsSecretarialAvailable: boolean;
  Secretarials: GenericKeyValuePair<string>[];
  IsSyncServerAvailable: boolean;
  OperationServers: AccessorReportOperationServer[];
  IsPersonnelSystemAvailable: boolean;
  WorkSections: GenericKeyValuePair<string>[];
}

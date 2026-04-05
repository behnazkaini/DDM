import { RenderState } from "./Chargoon.Reporting.Domain.Enumeration.RenderState";
import { CreationType } from "./Chargoon.Reporting.Domain.Enumeration.CreationType";

export interface InitialReportRequestViewModel {
  SoftwareGuid: string;
  UserId: number;
  RequestDateFrom: Date;
  RequestDateTo: Date;
  ReportTitle: string;
  RenderState: RenderState;
  Creationtype: CreationType;
}

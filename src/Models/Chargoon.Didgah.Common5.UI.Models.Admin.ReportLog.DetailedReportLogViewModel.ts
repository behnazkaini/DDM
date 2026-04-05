import { RenderState } from "./Chargoon.Reporting.Domain.Enumeration.RenderState";

export interface DetailedReportLogViewModel {
  RenderState: RenderState;
  StartTime: Date;
  EndTime: Date;
  StateResult: boolean;
  FailureDetail: string;
}

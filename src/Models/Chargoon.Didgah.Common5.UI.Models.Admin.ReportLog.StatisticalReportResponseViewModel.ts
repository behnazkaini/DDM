export interface StatisticalReportResponseViewModel {
  TotalReportsCount: number;
  AgentBasedReportCount: number;
  WebBasedReportsCount: number;
  SuccessfulReportsCount: number;
  TotalFailedReportsCount: number;
  ExceptionFailedReportsCount: number;
  ThreadAbortExceptionFailedReportsCount: number;
  RenderingReportsCount: number;
  AgentQueueReportsCount: number;
  TotalCrystalReportsCount: number;
  TotalMicrosoftReportingCount: number;
  TotalChargoonReportingCount: number;
  TotalStimulsoftReportsCount: number;
  TotalStimulsoftPrintableReportsCount: number;
  TotalStimulsoftPreDesignReportsCount: number;
  TotalStimulsoftQueryableReportsCount: number;
  IsReportLogsEnabled: boolean;
}

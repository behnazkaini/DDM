export interface ArchiveFilter {
  Priority: number;
  Dismissed: number;
  Title: string;
  Sender: string;
  ReferenceSoftwareGuid: string;
  ReferenceFlag: string;
  ShowOtherStaffAlerts: boolean;
  QueryDateFrom: Date;
  QueryDateTo: Date;
  QueryAlertDateFrom: Date;
  QueryAlertDateTo: Date;
}

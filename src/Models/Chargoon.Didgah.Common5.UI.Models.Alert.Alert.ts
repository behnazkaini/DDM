export interface Alert {
  ID: number;
  PriorityId: number;
  Date: Date;
  AlertDate: Date;
  Title: string;
  SenderTitle: string;
  ReferenceSoftwareGuid: string;
  ReferenceFlag: number;
  Body: string;
  OpenReference: boolean;
  ReferenceId: string;
  ReferenceGuid: string;
  New: boolean;
  Dismissed: boolean;
  Dismissable: boolean;
  Flag: number;
  Published: boolean;
  NeedToSwitchStaff: boolean;
  OwnerID: string;
  WorkflowUsecaseGuid: string;
  ExtendedInfo: string;
}

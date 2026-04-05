export interface AlertViewModel {
  ID: number;
  Guid: string;
  PriorityId: number;
  PriorityColor: string;
  Date: Date;
  AlertDate: Date;
  AlertDateGroup: Date;
  Title: string;
  SenderTitle: string;
  ReferenceSoftwareGuid: string;
  Body: string;
  ReferenceIdEncrypted: string;
  ReferenceGuidEncrypted: string;
  ReferenceFlag: number;
  OpenReference: boolean;
  NeedToSwitchStaff: boolean;
  WorkflowUsecaseGuid: string;
  Unread: boolean;
  Dismissable: boolean;
  OwnerID: number;
  ExtendedInfo: string;
}

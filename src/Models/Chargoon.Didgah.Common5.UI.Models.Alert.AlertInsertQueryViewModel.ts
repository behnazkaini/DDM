export interface AlertInsertQueryViewModel {
  PriorityId: number;
  AlertDate: Date;
  Title: string;
  SenderTitle: string;
  ReferenceSoftwareGuid: string;
  ReferenceFlag: number;
  Body: string;
  OpenReference?: boolean;
  ReferenceIdEncrypted: string;
  ReferenceGuidEncrypted: string;
}

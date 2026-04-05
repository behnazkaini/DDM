export interface StaffRelationHistoryResponseViewModel {
  Id: number;
  ModificationDate: Date;
  StaffPersonRelationType: string;
  EventType: string;
  RegistrarUserFullName: string;
  StaffTitle: string;
  Relations: string[];
}

export interface AlertSnoozeQueryViewModel {
  Id: string;
  Minuts: number;
  Date: Date;
  Activate: boolean;
  SoftwareGuid: string;
  IncludeOtherAssignedStaffsAlerts?: boolean;
}

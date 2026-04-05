export interface BackgroundTaskViewModel {
  ID: number;
  TaskGuid: string;
  Title: string;
  SoftwareTitle: string;
  JobState: string;
  LastExecution: Date;
  NextExecution: Date;
  CreateDate: Date;
}

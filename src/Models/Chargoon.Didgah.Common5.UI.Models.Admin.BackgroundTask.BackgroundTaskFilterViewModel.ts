import { BackgroundTaskType } from "./Chargoon.Didgah.Common.Domain.Enumeration.BackgroundTaskType";

export interface BackgroundTaskFilterViewModel {
  TaskType: BackgroundTaskType;
  FromCreateDate: Date;
  ToCreateDate: Date;
  SoftwareGuid: string;
  State: number;
}

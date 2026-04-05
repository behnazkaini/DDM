import { WorkflowInstanceStatus } from "./Chargoon.Zagrose.ProcessEngine.Workflow.Common.Enumeration.WorkflowInstanceStatus";

export interface WorkflowInstancesFilterViewModel {
  Identifier: number;
  WorkflowGuid: string;
  Title: string;
  OwnerTitle: string;
  Status: WorkflowInstanceStatus;
  StartDate: Date;
  EndDate: Date;
}

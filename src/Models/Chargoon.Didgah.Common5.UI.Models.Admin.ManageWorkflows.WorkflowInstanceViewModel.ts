import { WorkflowInstanceStatus } from "./Chargoon.Zagrose.ProcessEngine.Workflow.Common.Enumeration.WorkflowInstanceStatus";

export interface WorkflowInstanceViewModel {
  InstanceId: string;
  Title: string;
  OwnerTitle: string;
  Identifier: number;
  Status: WorkflowInstanceStatus;
  StartDate: Date;
  WorkflowState: string;
}

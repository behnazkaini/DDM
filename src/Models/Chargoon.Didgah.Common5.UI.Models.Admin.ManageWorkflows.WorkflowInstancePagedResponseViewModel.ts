import { WorkflowInstanceViewModel } from "./Chargoon.Didgah.Common5.UI.Models.Admin.ManageWorkflows.WorkflowInstanceViewModel";

export interface WorkflowInstancePagedResponseViewModel {
  Data: WorkflowInstanceViewModel[];
  TotalCount: number;
}

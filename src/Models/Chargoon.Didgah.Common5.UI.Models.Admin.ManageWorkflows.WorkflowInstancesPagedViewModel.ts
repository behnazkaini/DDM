import { WorkflowInstancesFilterViewModel } from "./Chargoon.Didgah.Common5.UI.Models.Admin.ManageWorkflows.WorkflowInstancesFilterViewModel";

export interface WorkflowInstancesPagedViewModel {
  PageSize: number;
  PageIndex: number;
  Metadata: WorkflowInstancesFilterViewModel;
}

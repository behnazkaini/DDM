export interface IndicatorViewModel {
  Guid: string;
  Title: string;
  Code: string;
  Active: boolean;
  DisplayFormat: string;
  SoftwareGuid: string;
  DepartmentGuid: string;
  ParentGuid: string;
  ReferenceEntityGuid: string;
  IndicatorRepositoryGuid: string;
  OperationGuid: string;
  SelectedUsageTypeGuids: string[];
}

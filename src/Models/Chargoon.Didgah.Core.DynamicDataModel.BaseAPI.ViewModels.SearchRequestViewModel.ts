import { SearchConditionGroupViewModel } from "./Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.SearchConditionGroupViewModel";

export interface SearchRequestViewModel {
  DataModelGuid: string;
  ColumnGuids: string[];
  ConditionGroup: SearchConditionGroupViewModel;
  MaxCount: number;
}

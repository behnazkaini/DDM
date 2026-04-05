import { AddDataModelVariableViewModel } from "./Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.DataModel.AddDataModelVariableViewModel";

export interface SaveDataModelVariableViewModel {
  Added: AddDataModelVariableViewModel[];
  Deleted?: string[];
}

import { ConditionGroupViewModel } from "./Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.ConditionGroupViewModel";

export interface ComplexValidationViewModel {
  Guid: string;
  ConditionGroup: ConditionGroupViewModel;
  Message: string;
}

import { ColumnValidationResultViewModel } from "./Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.ColumnValidationResultViewModel";

export interface TableValidationResultViewModel {
  Succeed: boolean;
  Name: string;
  ErrorMessage: string;
  Columns: ColumnValidationResultViewModel[];
}

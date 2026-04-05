import { LayoutViewModel } from "./Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.LayoutViewModel";
import { ValidationViewModel } from "./Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.ValidationViewModel";
import { ComplexValidationViewModel } from "./Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.ComplexValidationViewModel";

export interface InlineArchiveLayoutViewModel extends LayoutViewModel {
  Validations: ValidationViewModel[];
  ComplexValidations: ComplexValidationViewModel[];
}

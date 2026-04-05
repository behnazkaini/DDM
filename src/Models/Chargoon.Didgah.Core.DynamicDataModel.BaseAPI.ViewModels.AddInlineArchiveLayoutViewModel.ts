import { AddLayoutViewModel } from "./Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.AddLayoutViewModel";
import { SaveValidationViewModel } from "./Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.SaveValidationViewModel";
import { SaveComplexValidationViewModel } from "./Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.SaveComplexValidationViewModel";

export interface AddInlineArchiveLayoutViewModel extends AddLayoutViewModel {
  Validations: SaveValidationViewModel[];
  ComplexValidations: SaveComplexValidationViewModel[];
}

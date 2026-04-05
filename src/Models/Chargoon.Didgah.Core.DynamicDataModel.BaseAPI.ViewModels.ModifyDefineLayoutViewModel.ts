import { ModifyLayoutViewModel } from "./Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.ModifyLayoutViewModel";
import { SaveValidationViewModel } from "./Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.SaveValidationViewModel";
import { SaveComplexValidationViewModel } from "./Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.SaveComplexValidationViewModel";

export interface ModifyDefineLayoutViewModel extends ModifyLayoutViewModel {
  Validations: SaveValidationViewModel[];
  ComplexValidations: SaveComplexValidationViewModel[];
}

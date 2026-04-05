import { LayoutItemViewModel } from "./Chargoon.Didgah.Common5.UI.Models.DynamicDataModel.LayoutItemViewModel";
import { FormDataViewModel } from "./Chargoon.Didgah.Common5.UI.Models.DynamicDataModel.FormDataViewModel";

export interface FormGeneratorViewModel {
  DataModelId: number;
  Layoutkey: string;
  DesigendForm: string;
  LayoutItems: LayoutItemViewModel[];
  formData: FormDataViewModel;
}

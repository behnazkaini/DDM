import { FormEntityValueModel } from "./Chargoon.Didgah.Common5.UI.Models.DynamicDataModel.FormEntityValueModel";
import { FormDeleteValueModel } from "./Chargoon.Didgah.Common5.UI.Models.DynamicDataModel.FormDeleteValueModel";

export interface FormValueViewModel {
  LayoutKey: string;
  DataModelId: number;
  RecordGuid: string;
  Added: FormEntityValueModel[];
  Deleted: FormDeleteValueModel[];
  Modified: FormEntityValueModel[];
}

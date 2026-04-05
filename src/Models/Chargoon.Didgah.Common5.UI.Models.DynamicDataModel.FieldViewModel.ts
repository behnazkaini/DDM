import { FieldTypeViewModel } from "./Chargoon.Didgah.Common5.UI.Models.DynamicDataModel.FieldTypeViewModel";
import { RowStatus } from "./Chargoon.Didgah.Common5.UI.Models.DynamicDataModel.RowStatus";

export interface FieldViewModel {
  Id: string;
  Guid: string;
  ParentGuid: string;
  Name: string;
  Label: string;
  TypeGuid: string;
  Type: FieldTypeViewModel;
  IsRequired: boolean;
  IsDisabled: boolean;
  Settings: string;
  Bookmark: string;
  __status: RowStatus;
  FieldInstances: FieldViewModel[];
  FieldId: number;
}

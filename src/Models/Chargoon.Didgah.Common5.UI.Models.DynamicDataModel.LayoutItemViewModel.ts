import { LayoutFieldViewModel } from "./Chargoon.Didgah.Common5.UI.Models.DynamicDataModel.LayoutFieldViewModel";
import { LayoutItemRelation } from "./Chargoon.Didgah.Common5.UI.Models.DynamicDataModel.LayoutItemRelation";
import { LayoutItemValidationModel } from "./Chargoon.Didgah.Core.DDM.BaseAPI.Models.LayoutItemValidationModel";

export class LayoutItemViewModel {
  Id: number;
  EntityId: string;
  FieldInstance: LayoutFieldViewModel;
  LayoutItemDefaultValue: string;
  EditWidgetId: string;
  DisplayWidgetId: string;
  SearchWidgetId: string;
  Setting: string;
  IsBundle: boolean;
  Relation: LayoutItemRelation;
  LayoutItems: LayoutItemViewModel[];
  ValidationRules: LayoutItemValidationModel[];
}

import { DataModelViewModel } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.DataModelViewModel";
import { LayoutItemViewModel } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.LayoutItemViewModel";
import { SaveRowViewModel } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.SaveRowViewModel";
import { ConditionType } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.ConditionType";
import { LayoutItemType } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.LayoutItemType";

export interface OneToOneRelationConditionSetting {
  KeyValues: { key: string; label: string },
  Value: { Guid: string }
}

export interface OneToManyRelationConditionSetting {
  KeyValues: { id: string; title: string }[],
  Value: { Guid: string }[];
}

export interface ConditionSetting<TValue> {
  Value: TValue;
}

export default abstract class LayoutItemValidator<TLayoutItem extends LayoutItemViewModel> {
  abstract layoutItemType: LayoutItemType;
  public abstract isTrue(layoutItem: TLayoutItem, row: SaveRowViewModel, conditionType: ConditionType, serializedSetting: string, dataModel: DataModelViewModel): boolean;
}
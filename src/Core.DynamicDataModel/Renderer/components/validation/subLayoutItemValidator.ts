import { DataModelViewModel } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.DataModelViewModel";
import { SaveRowViewModel } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.SaveRowViewModel";
import { SubLayoutItemViewModel } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.SubLayoutItemViewModel";
import { ConditionType } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.ConditionType";
import { LayoutItemType } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.LayoutItemType";
import { RelationType } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.RelationType";
import { RowState } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.RowState";
import LayoutItemValidator, { ConditionSetting } from "./layoutItemValidator";

export default class LayoutItemReferenceValidator extends LayoutItemValidator<SubLayoutItemViewModel> {

  layoutItemType: LayoutItemType = LayoutItemType.SubLayout;

  public isTrue(layoutItem: SubLayoutItemViewModel, row: SaveRowViewModel, conditionType: ConditionType, serializedSetting: string,dataModel: DataModelViewModel): boolean {
    const relation = dataModel.Relations.find(x => x.Guid == layoutItem.RelationGuid);

    if (relation.Type == RelationType.OneToOne) {
      const primaryKey = row.KeyValues.find(x => x.Key == relation.Guid)?.Value;
      switch (conditionType) {
        case ConditionType.HasValue:
          {
            return !!primaryKey;
          }
        case ConditionType.HasValue:
          {
            return !!!primaryKey;
          }
        default:
          {
            throw new Error(`not supported condition type => ${conditionType}`);
          }
      }
    }
    else if (relation.Type == RelationType.OneToMany) {
      const primaryKeys = (row.KeyValues.find(x => x.Key == relation.Guid).Value as SaveRowViewModel[] ?? [])
        .filter(x => x.State == RowState.Added || x.State == RowState.Unchanged)
        .map(x => x.PrimaryKey);
      switch (conditionType) {
        case ConditionType.GreaterEquals:
          {
            const setting = JSON.parse(serializedSetting) as ConditionSetting<number>;
            return primaryKeys.length >= setting.Value;
          }
        case ConditionType.LowerEquals:
          {
            const setting = JSON.parse(serializedSetting) as ConditionSetting<number>;
            return primaryKeys.length <= setting.Value;
          }
        case ConditionType.Greater:
          {
            const setting = JSON.parse(serializedSetting) as ConditionSetting<number>;
            return primaryKeys.length > setting.Value;
          }
        case ConditionType.Lower:
          {
            const setting = JSON.parse(serializedSetting) as ConditionSetting<number>;
            return primaryKeys.length < setting.Value;
          }
        default:
          {
            throw new Error(`not supported condition type => ${conditionType}`);
          }
      }
    }
    else {
      throw new Error(`not supported relation type => ${relation.Type}`);
    }
  }

}
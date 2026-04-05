import { DataModelViewModel } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.DataModelViewModel";
import { LayoutItemReferenceViewModel } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.LayoutItemReferenceViewModel";
import { SaveRowViewModel } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.SaveRowViewModel";
import { ConditionType } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.ConditionType";
import { LayoutItemType } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.LayoutItemType";
import { RelationType } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.RelationType";
import { RowState } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.RowState";
import LayoutItemValidator, { ConditionSetting, OneToManyRelationConditionSetting, OneToOneRelationConditionSetting } from "./layoutItemValidator";

export default class LayoutItemReferenceValidator extends LayoutItemValidator<LayoutItemReferenceViewModel> {
  layoutItemType: LayoutItemType = LayoutItemType.Reference;

  public isTrue(layoutItem: LayoutItemReferenceViewModel, row: SaveRowViewModel, conditionType: ConditionType, serializedSetting: string, dataModel: DataModelViewModel): boolean {
    const relation = dataModel.Relations.find(x => x.Guid == layoutItem.RelationGuid);
    const primaryKeys = (row.KeyValues.find(x => x.Key == relation.Guid)?.Value as SaveRowViewModel[] ?? [])
      .filter(x => x.State == RowState.Added || x.State == RowState.Unchanged)
      .map(x => x.PrimaryKey);
    if (relation.Type == RelationType.OneToOne) {
      const setting = JSON.parse(serializedSetting) as ConditionSetting<OneToOneRelationConditionSetting>;
      switch (conditionType) {
        case ConditionType.HasValue:
          {
            return !!primaryKeys.length;
          }
        case ConditionType.HasNotValue:
          {
            return !!!primaryKeys.length;
          }
        case ConditionType.Equals:
          {
            return primaryKeys.length > 0 && primaryKeys[0].toLowerCase() === setting.Value.KeyValues.key.toLowerCase();
          }
        case ConditionType.NotEquals:
          {
            return primaryKeys.length > 0 && primaryKeys[0].toLowerCase() !== setting.Value.KeyValues.key.toLowerCase();
          }
        default:
          {
            throw new Error(`not supported condition type => ${conditionType}`);
          }
      }
    }
    else if (relation.Type == RelationType.OneToMany) {
      switch (conditionType) {
        case ConditionType.HasValue:
          {
            return !!primaryKeys.length;
          }
        case ConditionType.HasNotValue:
          {
            return !!!primaryKeys.length;
          }
        case ConditionType.Equals:
          {
            const setting = JSON.parse(serializedSetting) as ConditionSetting<OneToManyRelationConditionSetting>;
            const primaryKeys = (row.KeyValues.find(x => x.Key == relation.Guid)?.Value as SaveRowViewModel[] ?? [])
              .filter(x => x.State == RowState.Added || x.State == RowState.Unchanged)
              .map(x => x.PrimaryKey.toLowerCase());

            return JSON.stringify(primaryKeys.sort()) === JSON.stringify(setting.Value.Value.map(valueGuid => valueGuid.Guid.toLowerCase()).sort())
          }
        case ConditionType.NotEquals:
          {
            const setting = JSON.parse(serializedSetting) as ConditionSetting<OneToManyRelationConditionSetting>;
            const primaryKeys = (row.KeyValues.find(x => x.Key == relation.Guid)?.Value as SaveRowViewModel[] ?? [])
              .filter(x => x.State == RowState.Added || x.State == RowState.Unchanged)
              .map(x => x.PrimaryKey.toLowerCase());

            return JSON.stringify(primaryKeys.sort()) !== JSON.stringify(setting.Value.Value.map(valueGuid => valueGuid.Guid.toLowerCase()).sort())
          }
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
        case ConditionType.Contains:
          {
            const setting = JSON.parse(serializedSetting) as ConditionSetting<OneToManyRelationConditionSetting>;
            return setting.Value?.Value.every(x => primaryKeys.find(pk => pk.toString().toLowerCase() === x.Guid.toLowerCase()))
          }
        case ConditionType.NotContains:
          {
            const setting = JSON.parse(serializedSetting) as ConditionSetting<OneToManyRelationConditionSetting>;
            return !setting.Value?.Value.every(x => primaryKeys.find(pk => pk.toString().toLowerCase() === x.Guid.toLowerCase()))
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
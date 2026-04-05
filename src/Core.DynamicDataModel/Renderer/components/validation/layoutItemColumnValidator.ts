import { LayoutItemType } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.LayoutItemType";
import { DataModelViewModel } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.DataModelViewModel";
import { LayoutItemColumnViewModel } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.LayoutItemColumnViewModel";
import { SaveRowViewModel } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.SaveRowViewModel";
import { ColumnDataType } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.ColumnDataType";
import { ConditionType } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.ConditionType";
import LayoutItemValidator, { ConditionSetting } from "./layoutItemValidator";
import { calendar } from "didgah/common";

export default class LayoutItemColumnValidator extends LayoutItemValidator<LayoutItemColumnViewModel> {
  layoutItemType: LayoutItemType = LayoutItemType.Column;
  validators: ColumnValidator<any>[] = [
    new StringValidator(),
    new BigIntegerValidator(),
    new IntegerValidator(),
    new DecimalValidator(),
    new DateTimeValidator(),
    new BooleanValidator()
  ]

  public isTrue(layoutItem: LayoutItemColumnViewModel, row: SaveRowViewModel, conditionType: ConditionType, serializedSetting: string, dataModel: DataModelViewModel) {
    const column = dataModel.Columns.find(x => x.Guid == layoutItem.ColumnGuid);
    const validator = this.validators.find(x => x.dataType == column.DataType);
    const value = row.KeyValues.find(x => x.Key == column.Guid)?.Value;
    return validator.isTrue(
      value,
      conditionType,
      serializedSetting
    );
  }

}

abstract class ColumnValidator<TValue> {
  abstract dataType: ColumnDataType;
  public abstract isTrue(value: TValue, conditionType: ConditionType, serializedSetting: string): boolean;
}

class StringValidator extends ColumnValidator<string> {
  dataType: ColumnDataType = ColumnDataType.String;
  public isTrue(value: string, conditionType: ConditionType, serializedSetting: string): boolean {
    switch (conditionType) {
      case ConditionType.HasValue:
        {
          return !!value;
        }
      case ConditionType.HasNotValue:
        {
          return !!!value;
        }
      case ConditionType.Equals:
        {
          const setting = JSON.parse(serializedSetting) as ConditionSetting<string>;
          return value === setting.Value;
        }
      case ConditionType.NotEquals:
        {
          const setting = JSON.parse(serializedSetting) as ConditionSetting<string>;
          return value !== setting.Value;
        }
      case ConditionType.GreaterEquals:
        {
          const setting = JSON.parse(serializedSetting) as ConditionSetting<number>;
          return value?.length >= setting.Value;
        }
      case ConditionType.LowerEquals:
        {
          const setting = JSON.parse(serializedSetting) as ConditionSetting<number>;
          return value?.length <= setting.Value;
        }
      case ConditionType.Greater:
        {
          const setting = JSON.parse(serializedSetting) as ConditionSetting<number>;
          return value?.length > setting.Value;
        }
      case ConditionType.Lower:
        {
          const setting = JSON.parse(serializedSetting) as ConditionSetting<number>;
          return value?.length < setting.Value;
        }
      case ConditionType.Contains:
        {
          const setting = JSON.parse(serializedSetting) as ConditionSetting<string>;
          return value?.indexOf(setting.Value) > -1;
        }
      case ConditionType.NotContains:
        {
          const setting = JSON.parse(serializedSetting) as ConditionSetting<string>;
          return value?.indexOf(setting.Value) == -1;
        }
      case ConditionType.StartsWith:
        {
          const setting = JSON.parse(serializedSetting) as ConditionSetting<string>;
          return value?.startsWith(setting.Value) ?? false;
        }
      case ConditionType.EndsWith:
        {
          const setting = JSON.parse(serializedSetting) as ConditionSetting<string>;
          return value?.endsWith(setting.Value) ?? false;
        }
      default:
        {
          throw new Error(`not supported condition type => ${conditionType}`);
        }
    }
  }
}

class BooleanValidator extends ColumnValidator<boolean> {
  dataType: ColumnDataType = ColumnDataType.Boolean;
  public isTrue(value: boolean, conditionType: ConditionType, serializedSetting: string): boolean {
    switch (conditionType) {
      case ConditionType.Equals: {
        const setting = JSON.parse(serializedSetting) as ConditionSetting<boolean>;
        return value === setting.Value;
      }
      case ConditionType.NotEquals: {
        const setting = JSON.parse(serializedSetting) as ConditionSetting<boolean>;
        return value !== setting.Value;
      }
      case ConditionType.HasValue: {
        return !!value;
      }
      case ConditionType.HasNotValue: {
        return !value;
      }
      default:
        {
          throw new Error(`not supported condition type => ${conditionType}`);
        }
    }
  }
}

class DateTimeValidator extends ColumnValidator<Date> {
  dataType: ColumnDataType = ColumnDataType.DateTime;
  public isTrue(value: Date, conditionType: ConditionType, serializedSetting: string): boolean {
    switch (conditionType) {
      case ConditionType.HasValue:
        {
          return !!value;
        }
      case ConditionType.HasNotValue:
        {
          return !!!value;
        }
      case ConditionType.Equals:
        {
          const setting = JSON.parse(serializedSetting) as ConditionSetting<Date>;
          if (!!value) {
            return calendar.isSame(calendar.getStringFromDate(value), calendar.getStringFromDate(setting.Value as any))
          }
          return value == setting.Value;
        }
      case ConditionType.NotEquals:
        {
          const setting = JSON.parse(serializedSetting) as ConditionSetting<Date>;
          if (!!value) {
            return !calendar.isSame(calendar.getStringFromDate(value), calendar.getStringFromDate(setting.Value as any))
          }
          return value != setting.Value;
        }
      case ConditionType.GreaterEquals:
        {
          const setting = JSON.parse(serializedSetting) as ConditionSetting<Date>;
          if (!!value) {
            return calendar.isSameOrAfter(calendar.getStringFromDate(value), calendar.getStringFromDate(setting.Value as any))
          }

          return value >= setting.Value;
        }
      case ConditionType.LowerEquals:
        {
          const setting = JSON.parse(serializedSetting) as ConditionSetting<Date>;
          if (!!value) {
            return calendar.isSameOrBefore(calendar.getStringFromDate(value), calendar.getStringFromDate(setting.Value as any))
          }
          return value <= setting.Value;
        }
      case ConditionType.Greater:
        {
          const setting = JSON.parse(serializedSetting) as ConditionSetting<Date>;
          if (!!value) {
            return calendar.isAfter(calendar.getStringFromDate(value), calendar.getStringFromDate(setting.Value as any))
          }
          return value > setting.Value;
        }
      case ConditionType.Lower:
        {
          const setting = JSON.parse(serializedSetting) as ConditionSetting<Date>;
          if (!!value) {
            return calendar.isBefore(calendar.getStringFromDate(value), calendar.getStringFromDate(setting.Value as any))
          }
          return value < setting.Value;
        }
      default:
        {
          throw new Error(`not supported condition type => ${conditionType}`);
        }
    }
  }
}

abstract class NumericalValidator extends ColumnValidator<number> {
  public isTrue(value: number, conditionType: ConditionType, serializedSetting: string): boolean {
    switch (conditionType) {
      case ConditionType.HasValue:
        {
          return !!value;
        }
      case ConditionType.HasNotValue:
        {
          return !!!value;
        }
      case ConditionType.Equals:
        {
          const setting = JSON.parse(serializedSetting) as ConditionSetting<number>;
          return value == setting.Value;
        }
      case ConditionType.NotEquals:
        {
          const setting = JSON.parse(serializedSetting) as ConditionSetting<number>;
          return value != setting.Value;
        }
      case ConditionType.GreaterEquals:
        {
          const setting = JSON.parse(serializedSetting) as ConditionSetting<number>;
          return value >= setting.Value;
        }
      case ConditionType.LowerEquals:
        {
          const setting = JSON.parse(serializedSetting) as ConditionSetting<number>;
          return value <= setting.Value;
        }
      case ConditionType.Greater:
        {
          const setting = JSON.parse(serializedSetting) as ConditionSetting<number>;
          return value > setting.Value;
        }
      case ConditionType.Lower:
        {
          const setting = JSON.parse(serializedSetting) as ConditionSetting<number>;
          return value < setting.Value;
        }
      case ConditionType.StartsWith:
        {
          const setting = JSON.parse(serializedSetting) as ConditionSetting<number>;
          return value?.toString().startsWith(setting.Value.toString()) ?? false;
        }
      case ConditionType.EndsWith:
        {
          const setting = JSON.parse(serializedSetting) as ConditionSetting<number>;
          return value?.toString().endsWith(setting.Value.toString()) ?? false;
        }
      default:
        {
          throw new Error(`not supported condition type => ${conditionType}`);
        }
    }
  }
}

class BigIntegerValidator extends NumericalValidator {
  dataType: ColumnDataType = ColumnDataType.BigInteger;
}

class IntegerValidator extends NumericalValidator {
  dataType: ColumnDataType = ColumnDataType.Integer;
}

class DecimalValidator extends NumericalValidator {
  dataType: ColumnDataType = ColumnDataType.Decimal;
}

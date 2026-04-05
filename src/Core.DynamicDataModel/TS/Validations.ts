import { Checkbox, DateTimePicker, injectContext, Input, InputNumber, NumericalInput } from "didgah/ant-core-component";
import { LayoutItemType } from "../../Models/Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.LayoutItemType";
import { EditWidget, FieldTypes } from "../../typings/Core.DynamicDataModel/Enums";
import { GetFieldConditionParams, IComplexValidationConditions, IDictionary, ILayoutItemColumnSimpleValidation, ILayoutItemComplexValidation, IWidget, SimpleValidationGeneratorParams, ValidationCondition } from "../../typings/Core.DynamicDataModel/Types";
import { RelationViewModel } from "../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.RelationViewModel";
import { ColumnViewModel } from "../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.ColumnViewModel";
import { RelationType } from "../../Models/Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.RelationType";
import { $enum } from "ts-enum-util";
import { RelationNature } from "../../Models/Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.RelationNature";
import EditWidgets from "../Widget/Edit";
import { ConditionType } from "../../Models/Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.ConditionType";
import { ValidationType } from "../../Models/Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.ValidationType";
import RequiredSetting from "../Designer/components/validationForm/requiredField";
import StringRangeSetting from "../Designer/components/validationForm/stringRange";
import RegexFieldSetting from "../Designer/components/validationForm/regexField";
import IntegerRangeSetting from "../Designer/components/validationForm/integerRange";
import BigIntegerRangeSetting from "../Designer/components/validationForm/bigIntRange";
import DecimalRangeSetting from "../Designer/components/validationForm/decimalRange";
import DateTimeRangeSetting from "../Designer/components/validationForm/dateTimeRage";
import { ColumnDataType } from "../../Models/Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.ColumnDataType";


const ColumnsTypesOperators: IDictionary<ILayoutItemComplexValidation> = {
    "1": {
        Name: FieldTypes.String,
        ConditionTypes: [
            { operator: ConditionType.HasValue, dataType: ColumnDataType.String, extraProps: {} },
            { operator: ConditionType.HasNotValue, dataType: ColumnDataType.String, extraProps: {} },
            { operator: ConditionType.Equals, dataType: ColumnDataType.String, extraProps: {} },
            { operator: ConditionType.NotEquals, dataType: ColumnDataType.String, extraProps: {} },
            { operator: ConditionType.GreaterEquals, Widget: EditWidgets(EditWidget.InputNumber).component, dataType: ColumnDataType.Integer, extraProps: { min: 0 } },
            { operator: ConditionType.LowerEquals, Widget: EditWidgets(EditWidget.InputNumber).component, dataType: ColumnDataType.Integer, extraProps: { min: 0 } },
            { operator: ConditionType.Greater, Widget: EditWidgets(EditWidget.InputNumber).component, dataType: ColumnDataType.Integer, extraProps: { min: 0 } },
            { operator: ConditionType.Lower, Widget: EditWidgets(EditWidget.InputNumber).component, dataType: ColumnDataType.Integer, extraProps: { min: 0 } },
            { operator: ConditionType.Contains, dataType: ColumnDataType.String, extraProps: {} },
            { operator: ConditionType.NotContains, dataType: ColumnDataType.String, extraProps: {} },
            { operator: ConditionType.StartsWith, dataType: ColumnDataType.String, extraProps: {} },
            { operator: ConditionType.EndsWith, dataType: ColumnDataType.String, extraProps: {} },
        ]
    },
    "2": {
        Name: FieldTypes.Decimal,
        ConditionTypes: [
            { operator: ConditionType.HasValue, dataType: ColumnDataType.Decimal, extraProps: {} },
            { operator: ConditionType.HasNotValue, dataType: ColumnDataType.Decimal, extraProps: {} },
            { operator: ConditionType.Equals, dataType: ColumnDataType.Decimal, extraProps: { allowFloatNumbers: true, allowNegativeNumbers: true, doNotConvertValueToNumber: true } },
            { operator: ConditionType.NotEquals, dataType: ColumnDataType.Decimal, extraProps: { allowFloatNumbers: true, allowNegativeNumbers: true, doNotConvertValueToNumber: true } },
            { operator: ConditionType.GreaterEquals, dataType: ColumnDataType.Decimal, extraProps: { allowFloatNumbers: true, allowNegativeNumbers: true, doNotConvertValueToNumber: true } },
            { operator: ConditionType.LowerEquals, dataType: ColumnDataType.Decimal, extraProps: { allowFloatNumbers: true, allowNegativeNumbers: true, doNotConvertValueToNumber: true } },
            { operator: ConditionType.Greater, dataType: ColumnDataType.Decimal, extraProps: { allowFloatNumbers: true, allowNegativeNumbers: true, doNotConvertValueToNumber: true } },
            { operator: ConditionType.Lower, dataType: ColumnDataType.Decimal, extraProps: { allowFloatNumbers: true, allowNegativeNumbers: true, doNotConvertValueToNumber: true } },
            { operator: ConditionType.StartsWith, dataType: ColumnDataType.Decimal, extraProps: { allowFloatNumbers: true, allowNegativeNumbers: true, doNotConvertValueToNumber: true } },
            { operator: ConditionType.EndsWith, dataType: ColumnDataType.Decimal, extraProps: { allowFloatNumbers: true, allowNegativeNumbers: true, doNotConvertValueToNumber: true } },

        ]
    },
    "3": {
        Name: FieldTypes.Integer,
        ConditionTypes: [
            { operator: ConditionType.HasValue, dataType: ColumnDataType.Integer, extraProps: {} },
            { operator: ConditionType.HasNotValue, dataType: ColumnDataType.Integer, extraProps: {} },
            { operator: ConditionType.Equals, dataType: ColumnDataType.Integer, extraProps: { allowFloatNumbers: false, allowNegativeNumbers: true, doNotConvertValueToNumber: true } },
            { operator: ConditionType.NotEquals, dataType: ColumnDataType.Integer, extraProps: { allowFloatNumbers: false, allowNegativeNumbers: true, doNotConvertValueToNumber: true } },
            { operator: ConditionType.GreaterEquals, dataType: ColumnDataType.Integer, extraProps: { allowFloatNumbers: false, allowNegativeNumbers: true, doNotConvertValueToNumber: true } },
            { operator: ConditionType.LowerEquals, dataType: ColumnDataType.Integer, extraProps: { allowFloatNumbers: false, allowNegativeNumbers: true, doNotConvertValueToNumber: true } },
            { operator: ConditionType.Greater, dataType: ColumnDataType.Integer, extraProps: { allowFloatNumbers: false, allowNegativeNumbers: true, doNotConvertValueToNumber: true } },
            { operator: ConditionType.Lower, dataType: ColumnDataType.Integer, extraProps: { allowFloatNumbers: false, allowNegativeNumbers: true, doNotConvertValueToNumber: true } },
            { operator: ConditionType.StartsWith, dataType: ColumnDataType.Integer, extraProps: { allowFloatNumbers: false, allowNegativeNumbers: true, doNotConvertValueToNumber: true } },
            { operator: ConditionType.EndsWith, dataType: ColumnDataType.Integer, extraProps: { allowFloatNumbers: false, allowNegativeNumbers: true, doNotConvertValueToNumber: true } },
        ],
    },
    "4": {
        Name: FieldTypes.Boolean,
        ConditionTypes: [
            { operator: ConditionType.HasValue, dataType: ColumnDataType.Boolean, extraProps: {} },
            { operator: ConditionType.HasNotValue, dataType: ColumnDataType.Boolean, extraProps: {} },
            { operator: ConditionType.Equals, Widget: injectContext(Checkbox), dataType: ColumnDataType.Boolean, extraProps: {} },
            { operator: ConditionType.NotEquals, Widget: injectContext(Checkbox), dataType: ColumnDataType.Boolean, extraProps: {} },
        ]
    },
    "5": {
        Name: FieldTypes.DateTime,
        ConditionTypes: [
            { operator: ConditionType.HasValue, dataType: ColumnDataType.DateTime, extraProps: {} },
            { operator: ConditionType.HasNotValue, dataType: ColumnDataType.DateTime, extraProps: {} },
            { operator: ConditionType.Equals, dataType: ColumnDataType.DateTime, extraProps: { valueType: "string" } },
            { operator: ConditionType.NotEquals, dataType: ColumnDataType.DateTime, extraProps: { valueType: "string" } },
            { operator: ConditionType.GreaterEquals, dataType: ColumnDataType.DateTime, extraProps: { valueType: "string" } },
            { operator: ConditionType.LowerEquals, dataType: ColumnDataType.DateTime, extraProps: { valueType: "string" } },
            { operator: ConditionType.Greater, dataType: ColumnDataType.DateTime, extraProps: { valueType: "string" } },
            { operator: ConditionType.Lower, dataType: ColumnDataType.DateTime, extraProps: { valueType: "string" } },
        ]
    },
    "6": {
        Name: FieldTypes.BigInteger,
        ConditionTypes: [
            { operator: ConditionType.HasValue, dataType: ColumnDataType.BigInteger, extraProps: {} },
            { operator: ConditionType.HasNotValue, dataType: ColumnDataType.BigInteger, extraProps: {} },
            { operator: ConditionType.Equals, dataType: ColumnDataType.BigInteger, extraProps: { allowFloatNumbers: false, allowNegativeNumbers: true, doNotConvertValueToNumber: true } },
            { operator: ConditionType.NotEquals, dataType: ColumnDataType.BigInteger, extraProps: { allowFloatNumbers: false, allowNegativeNumbers: true, doNotConvertValueToNumber: true } },
            { operator: ConditionType.GreaterEquals, dataType: ColumnDataType.BigInteger, extraProps: { allowFloatNumbers: false, allowNegativeNumbers: true, doNotConvertValueToNumber: true } },
            { operator: ConditionType.LowerEquals, dataType: ColumnDataType.BigInteger, extraProps: { allowFloatNumbers: false, allowNegativeNumbers: true, doNotConvertValueToNumber: true } },
            { operator: ConditionType.Greater, dataType: ColumnDataType.BigInteger, extraProps: { allowFloatNumbers: false, allowNegativeNumbers: true, doNotConvertValueToNumber: true } },
            { operator: ConditionType.Lower, dataType: ColumnDataType.BigInteger, extraProps: { allowFloatNumbers: false, allowNegativeNumbers: true, doNotConvertValueToNumber: true } },
            { operator: ConditionType.StartsWith, dataType: ColumnDataType.BigInteger, extraProps: { allowFloatNumbers: false, allowNegativeNumbers: true, doNotConvertValueToNumber: true } },
            { operator: ConditionType.EndsWith, dataType: ColumnDataType.BigInteger, extraProps: { allowFloatNumbers: false, allowNegativeNumbers: true, doNotConvertValueToNumber: true } },
        ]
    }
}

export const ColumnSimpleValidations: IDictionary<ILayoutItemColumnSimpleValidation> = {
    "0": {
        Name: null,
        ValidationTypes: []
    },
    "1": {
        Name: FieldTypes.String,
        ValidationTypes: [{ type: ValidationType.Required, widget: RequiredSetting }, { type: ValidationType.Range, widget: StringRangeSetting }, { type: ValidationType.Regex, widget: RegexFieldSetting }]
    },
    "2": {
        Name: FieldTypes.Decimal,
        ValidationTypes: [{ type: ValidationType.Required, widget: RequiredSetting }, { type: ValidationType.Range, widget: DecimalRangeSetting }, { type: ValidationType.Regex, widget: RegexFieldSetting }]
    },
    "3": {
        Name: FieldTypes.Integer,
        ValidationTypes: [{ type: ValidationType.Required, widget: RequiredSetting }, { type: ValidationType.Range, widget: IntegerRangeSetting }, { type: ValidationType.Regex, widget: RegexFieldSetting }]
    },
    "4": {
        Name: FieldTypes.Boolean,
        ValidationTypes: [{ type: ValidationType.Required, widget: RequiredSetting }]
    },
    "5": {
        Name: FieldTypes.DateTime,
        ValidationTypes: [{ type: ValidationType.Required, widget: RequiredSetting }, { type: ValidationType.Range, widget: DateTimeRangeSetting }]
    },
    "6": {
        Name: FieldTypes.BigInteger,
        ValidationTypes: [{ type: ValidationType.Required, widget: RequiredSetting }, { type: ValidationType.Range, widget: BigIntegerRangeSetting }, { type: ValidationType.Regex, widget: RegexFieldSetting }]
    },
    "7": {
      Name: FieldTypes.Reference,
      ValidationTypes: [{ type: ValidationType.Required, widget: RequiredSetting }]
  }
}

const RelationTypesOperators = (id: string, configeProps: object): ILayoutItemComplexValidation => {
    switch (id) {
        case "1":
            return {
                Name: $enum(RelationType).getKeyOrDefault(RelationType.OneToOne).toString(),
                ConditionTypes: [
                    { operator: ConditionType.HasValue, Widget: null, dataType: ColumnDataType.Boolean, extraProps: {} },
                    { operator: ConditionType.HasNotValue, Widget: null, dataType: ColumnDataType.Boolean, extraProps: {} },
                    { operator: ConditionType.Equals, Widget: (EditWidgets(EditWidget.ReferenceAutoComplete) as IWidget).component, dataType: { Nature: RelationNature.Aggregation, Type: RelationType.OneToOne }, extraProps: { ...configeProps } },
                    { operator: ConditionType.NotEquals, Widget: (EditWidgets(EditWidget.ReferenceAutoComplete) as IWidget).component, dataType: { Nature: RelationNature.Aggregation, Type: RelationType.OneToOne }, extraProps: { ...configeProps } },
                ]
            }
        case "2":
            return {
                Name: $enum(RelationType).getKeyOrDefault(RelationType.OneToMany).toString(),
                ConditionTypes: [
                    { operator: ConditionType.HasValue, Widget: null, dataType: ColumnDataType.Boolean, extraProps: {} },
                    { operator: ConditionType.HasNotValue, Widget: null, dataType: ColumnDataType.Boolean, extraProps: {} },
                    { operator: ConditionType.Equals, Widget: (EditWidgets(EditWidget.ReferenceTokenContainer) as IWidget).component, dataType: { Nature: RelationNature.Aggregation, Type: RelationType.OneToMany }, extraProps: { ...configeProps } },
                    { operator: ConditionType.NotEquals, Widget: (EditWidgets(EditWidget.ReferenceTokenContainer) as IWidget).component, dataType: { Nature: RelationNature.Aggregation, Type: RelationType.OneToMany }, extraProps: { ...configeProps } },
                    { operator: ConditionType.GreaterEquals, Widget: injectContext(InputNumber), dataType: ColumnDataType.Integer, extraProps: { min: 0 } },
                    { operator: ConditionType.LowerEquals, Widget: injectContext(InputNumber), dataType: ColumnDataType.Integer, extraProps: { min: 0 } },
                    { operator: ConditionType.Greater, Widget: injectContext(InputNumber), dataType: ColumnDataType.Integer, extraProps: { min: 0 } },
                    { operator: ConditionType.Lower, Widget: injectContext(InputNumber), dataType: ColumnDataType.Integer, extraProps: { min: 0 } },
                    { operator: ConditionType.Contains, Widget: (EditWidgets(EditWidget.ReferenceTokenContainer) as IWidget).component, dataType: { Nature: RelationNature.Aggregation, Type: RelationType.OneToMany }, extraProps: { ...configeProps } },
                    { operator: ConditionType.NotContains, Widget: (EditWidgets(EditWidget.ReferenceTokenContainer) as IWidget).component, dataType: { Nature: RelationNature.Aggregation, Type: RelationType.OneToMany }, extraProps: { ...configeProps } },
                ]
            }
        default:
            return {
                Name: null,
                ConditionTypes: []
            }
    }
}

const proxyRelationOperators = (type: RelationType, nature: RelationNature, configeProps: object) => {
    if (nature === RelationNature.Aggregation && type === RelationType.OneToOne) {
        return RelationTypesOperators("1", configeProps); // reference auto complete
    } else if (nature === RelationNature.Aggregation && type === RelationType.OneToMany) {
        return RelationTypesOperators("2", configeProps); // token container
    } else if (nature === RelationNature.Composition && type === RelationType.OneToOne) {
        return RelationTypesOperators("0", configeProps); // none
    } else if (nature === RelationNature.Composition && type === RelationType.OneToMany) {
        return RelationTypesOperators("0", configeProps); // none
    }
}

function ValidationAssistant(): IComplexValidationConditions {
    const GetFieldComplexCondition = (params: GetFieldConditionParams) => {
        const { layoutItem, viewModel, configeProps } = params;
        switch (layoutItem.Type) {
            case LayoutItemType.Column:
                return ColumnsTypesOperators[(viewModel as ColumnViewModel).DataType];

            case LayoutItemType.Reference:
            case LayoutItemType.SubLayout:
                return proxyRelationOperators((viewModel as RelationViewModel).Type, (viewModel as RelationViewModel).Nature, configeProps);

            default:
                throw new ReferenceError(`This type is not supported: {${layoutItem.Type}}`);
        }
    }

    const SimpleValidationGenerator = (params: SimpleValidationGeneratorParams) => {
        const { viewModel, layoutItemType, dataType } = params;

        if (layoutItemType === LayoutItemType.Column) {
            return ColumnSimpleValidations[dataType.toString()];
        }
        if (layoutItemType === LayoutItemType.Reference) {
          return ColumnSimpleValidations['7'];
        }
        // return unsupported type
        return ColumnSimpleValidations["0"];
    }

    return {
        GetFieldComplexCondition,
        SimpleValidationGenerator,
    }
}

export function getDefaultDataTypeSetting(dataType) {
    switch (Number(dataType)) {
        case ColumnDataType.String:
            return {
                maxLength: 128
            }
        case ColumnDataType.Decimal:
            return {
                precision: 18,
                scale: 0,
            }
        default:
            return null
    }
}
export default ValidationAssistant
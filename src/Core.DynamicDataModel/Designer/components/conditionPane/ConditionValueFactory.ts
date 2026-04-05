
import { LayoutItemType } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.LayoutItemType";
import { ConditionType } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.ConditionType";
import { RelationViewModel } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.RelationViewModel";
import { RelationNature } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.RelationNature";
import { RelationType } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.RelationType";
import { ColumnViewModel } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.ColumnViewModel";
import { TokenItem } from "didgah/ant-core-component";

export enum ConvertorMode {
    ToSave = "ToSave",
    ToComponent = "ToComponent",
}

interface ConditionValueByLyoutItemProps {
    conditionType: ConditionType,
    value: any,
    layoutItemType: LayoutItemType,
    viewModel: RelationViewModel | ColumnViewModel,
    convertorMode: ConvertorMode
}

export const ConditionValueByLayoutItemType = ({ conditionType, value, layoutItemType, viewModel, convertorMode }: ConditionValueByLyoutItemProps) => {
    switch (layoutItemType) {
        case LayoutItemType.Column:
            return ColumnTypeConsitionFactory({ conditionType, value, viewModel: viewModel as ColumnViewModel });
        case LayoutItemType.Reference:
            return ReferenceTypeConditionFactory({ conditionType, value, viewModel: viewModel as RelationViewModel, convertorMode });
        default:
            return new Error("Other LayoutItem type has not been defined yet!");
    }
}

const ReferenceTypeConditionFactory = ({ conditionType, value, viewModel, convertorMode }: { conditionType: ConditionType, value: any, viewModel: RelationViewModel, convertorMode: ConvertorMode }) => {
    const { Nature, Type } = viewModel;

    switch (Nature) {
        case RelationNature.Aggregation:
            return AggregationValueConvertor({ relationType: Type, value, conditionType, convertorMode })
        default:
            return new Error("Composition has not been defined yet!");
    }
}

const AggregationOneToOneConditionTypeValue = ({ value, conditionType, valueConvertor }: { value: any, conditionType: ConditionType, valueConvertor: ConvertorMethodType }) => {
    switch (conditionType) {
        case ConditionType.HasNotValue:
        case ConditionType.HasValue:
            return undefined;

        case ConditionType.Equals:
        case ConditionType.NotEquals:
            return valueConvertor(value);

        default:
            return new Error("Condition type is not supported!");
    }
}

const AggregationOneToManyConditionTypeValue = ({ value, conditionType, valueConvertor }: { value: any, conditionType: ConditionType, valueConvertor: ConvertorMethodType }) => {
    switch (conditionType) {
        case ConditionType.HasNotValue:
        case ConditionType.HasValue:
            return undefined;

        case ConditionType.Equals:
        case ConditionType.NotEquals:
        case ConditionType.Contains:
        case ConditionType.NotContains:
            return valueConvertor(value)

        case ConditionType.Greater:
        case ConditionType.GreaterEquals:
        case ConditionType.Lower:
        case ConditionType.LowerEquals:
            return value;

        default:
            return new Error("Condition type is not supported!");
    }
}

const AggreagationValueConvertorMethod = ({ convertorMode, relationType }: { convertorMode: ConvertorMode, relationType: RelationType }): ConvertorMethodType => {
    switch (convertorMode) {
        case ConvertorMode.ToComponent:
            switch (relationType) {
                case RelationType.OneToOne:
                    return saveModelToAutoComplete
                case RelationType.OneToMany:
                    return saveModelToTokenContainer
            }
        case ConvertorMode.ToSave:
            switch (relationType) {
                case RelationType.OneToOne:
                    return autoCompleteToSaveModel
                case RelationType.OneToMany:
                    return tokenContainerToSaveModel
            }
    }
}

const ColumnTypeConsitionFactory = ({ conditionType, value, viewModel }: { conditionType: ConditionType, value: any, viewModel: ColumnViewModel }) => {
    switch (conditionType) {
        case ConditionType.HasNotValue:
        case ConditionType.HasValue:
            return undefined;
        case ConditionType.Equals:
        case ConditionType.NotEquals:
        case ConditionType.Contains:
        case ConditionType.NotContains:
        case ConditionType.Greater:
        case ConditionType.GreaterEquals:
        case ConditionType.Lower:
        case ConditionType.LowerEquals:
        case ConditionType.StartsWith:
        case ConditionType.EndsWith:
            return value;
        default:
            return new Error("Condition type is not supported!");
    }
}

const AggregationValueConvertor = ({ value, relationType, conditionType, convertorMode }: { relationType: RelationType, value: any, conditionType: ConditionType, convertorMode: ConvertorMode }) => {
    switch (relationType) {
        case RelationType.OneToOne:
            return AggregationOneToOneConditionTypeValue({ value, conditionType, valueConvertor: AggreagationValueConvertorMethod({ convertorMode, relationType }) });
        case RelationType.OneToMany:
            return AggregationOneToManyConditionTypeValue({ value, conditionType, valueConvertor: AggreagationValueConvertorMethod({ convertorMode, relationType }) });
    }
}

interface AggregationOneToOneSaveConditionValue {
    Value: { Guid: string };
    KeyValues: { key: string, label: string };
}

interface AggregationOneToOneComponent {
    key: string, label: string
}

interface AggregationOneToManySaveConditionValue {
    Value: Array<{ Guid: string }>;
    KeyValues: Array<{ id: string; title: string; }>;
}

interface AggregationOneToManyComponent {
    tokens: Array<{ id: string; title: string; }>
}

type ConvertorMethodType = (value: any) => any;
const autoCompleteToSaveModel = (value: AggregationOneToOneComponent): AggregationOneToOneSaveConditionValue => {
    return {
        Value: { Guid: value.key },
        KeyValues: { key: value.key, label: value.label },
    };
}

const tokenContainerToSaveModel = (value: AggregationOneToManyComponent): AggregationOneToManySaveConditionValue => {
    return {
        Value: value.tokens.map((token) => {
            return { Guid: token.id };
        }),
        KeyValues: (value.tokens as Array<TokenItem>).map((token) => ({
            id: token.id,
            title: token.title,
        })),
    }
}

const saveModelToAutoComplete = (value: AggregationOneToOneSaveConditionValue): AggregationOneToOneComponent => {
    return value?.KeyValues
}

const saveModelToTokenContainer = (value: AggregationOneToManySaveConditionValue): AggregationOneToManyComponent => {
    return { tokens: value?.KeyValues }
}

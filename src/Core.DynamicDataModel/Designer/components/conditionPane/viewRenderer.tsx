import { FieldValue } from "@didgah-components/ant-querybuilder";
import { LocalComplexConditionContext } from "../../../Designer/store/reducers/designLayoutSlice";
import React from "react";
import { calendar, translate } from "didgah/common";
import { $enum } from "ts-enum-util";
import { ConditionType } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.ConditionType";
import ComplexValidationConditions from "../../../TS/Validations";
import { TokenItem } from "didgah/ant-core-component";
import { ColumnViewModel } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.ColumnViewModel";
import { LayoutItemType } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.LayoutItemType";
import { RelationViewModel } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.RelationViewModel";
import { LayoutItemReferenceViewModel } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.LayoutItemReferenceViewModel";
import {
  ILayoutItemComplexValidation,
  IRelationConditionDataType,
  ValidationCondition,
} from "../../../../typings/Core.DynamicDataModel/Types";
import { ColumnDataType } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.ColumnDataType";
import { RelationType } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.RelationType";

const viewRenderer = (fieldValue: FieldValue) => {
  const { widgetFactory, currentLayout } = React.useContext(
    LocalComplexConditionContext
  );
  const [loading, setLoading] = React.useState(true);
  const [fieldConsdition, setFieldCondition] =
    React.useState<ILayoutItemComplexValidation>();
  const Conditions = ComplexValidationConditions();
  const fieldLabel = JSON.parse(
    currentLayout.Items.find(
      (item) => item.Guid.toLowerCase() === fieldValue.field.toLowerCase()
    ).Design
  ).Label;
  const operatorLabel = translate(
    $enum(ConditionType).getKeyOrDefault(parseInt(fieldValue.operator))
  );

  const getLabel = (value: any): any => {
    const selectedLayoutItem = currentLayout.Items.find(
      (item) => item.Guid.toLowerCase() === fieldValue.field.toLowerCase()
    );

    const conditionValueType: ValidationCondition =
      fieldConsdition.ConditionTypes.find(
        (cond) => cond.operator === parseInt(fieldValue.operator)
      );

    if (
      conditionValueType.operator !== ConditionType.HasValue &&
      conditionValueType.operator !== ConditionType.HasNotValue
    ) {
      switch (selectedLayoutItem.Type) {
        case LayoutItemType.Column:
          switch (conditionValueType.dataType) {
            case ColumnDataType.Boolean:
              return Boolean(value) ? translate("True") : translate("False");
            case ColumnDataType.DateTime:
              return calendar.getShortDateTime(value);
            default:
              return value;
          }

        case LayoutItemType.Reference:
          switch (
            (conditionValueType.dataType as IRelationConditionDataType).Type
          ) {
            case RelationType.OneToOne:
              return value.KeyValues.label;

            case RelationType.OneToMany:
              return (value.KeyValues as Array<TokenItem>)
                .map((token) => token.title)
                .toString();

            default:
              return value;
          }
        default:
          return value;
      }
    } else {
      return "";
    }
  };

  React.useEffect(() => {
    if (fieldValue.field != null) {
      const selectedLayoutItem = currentLayout.Items.find(
        (item) => item.Guid.toLowerCase() === fieldValue.field.toLowerCase()
      );

      switch (selectedLayoutItem.Type) {
        case LayoutItemType.Column:
          const columnViewModel: ColumnViewModel =
            widgetFactory.getDetailOfDataModel(
              selectedLayoutItem
            ) as ColumnViewModel;

          const allColumnFieldOperator = Conditions.GetFieldComplexCondition({
            layoutItem: selectedLayoutItem,
            viewModel: columnViewModel,
          });

          setFieldCondition(allColumnFieldOperator);

          break;
        case LayoutItemType.Reference:
          const relationViewModel: RelationViewModel =
            widgetFactory.getDetailOfDataModel(
              selectedLayoutItem
            ) as RelationViewModel;

          const allRelationFieldOperator = Conditions.GetFieldComplexCondition({
            layoutItem: selectedLayoutItem,
            viewModel: relationViewModel,
            configeProps: {
              initValue: {
                metadata: {
                  ColumnGuids: (
                    selectedLayoutItem as LayoutItemReferenceViewModel
                  ).ColumnGuids,
                  DataModelGuid: relationViewModel.ReferenceDataModelGuid,
                },
              },
            },
          });

          setFieldCondition(allRelationFieldOperator);

          break;
        default:
          break;
      }
    }

    setLoading(false);
  }, []);

  return (
    <>
      {!loading &&
        `" ${fieldLabel} ${operatorLabel} ${getLabel(fieldValue.value)} "`}
    </>
  );
};

export default viewRenderer;

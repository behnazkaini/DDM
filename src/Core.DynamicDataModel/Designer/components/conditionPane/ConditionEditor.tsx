import { LayoutItemViewModel } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.LayoutItemViewModel";
import * as React from "react";
import {
  ILayoutItemComplexValidation,
  IRelationConditionDataType,
  IStateStack,
  IWidget,
  IWidgetFactory,
  LayoutViewModelWithState,
  ValidationCondition,
} from "../../../../typings/Core.DynamicDataModel/Types";
import {
  Button,
  Col,
  EditorProps,
  Form,
  Row,
  SelectEx,
  SelectItem,
  WrappedFormUtils,
} from "didgah/ant-core-component";
import { LayoutItemType } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.LayoutItemType";
import { $enum } from "ts-enum-util";
import { ConditionType } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.ConditionType";
import { translate } from "didgah/common";
import { LayoutViewModel } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.LayoutViewModel";
import { ColumnViewModel } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.ColumnViewModel";
import ComplexValidationConditions from "../../../TS/Validations";
import { RelationViewModel } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.RelationViewModel";
import { LayoutItemReferenceViewModel } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.LayoutItemReferenceViewModel";
import { ColumnDataType } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.ColumnDataType";
import { RelationType } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.RelationType";
import { ReactElementType } from "react-window";
import { WidgetType } from "../../../../typings/Core.DynamicDataModel/Enums";
import { ConditionValueByLayoutItemType, ConvertorMode } from "./ConditionValueFactory";

const FieldItem = Form.Item;
type ConditionEditorProps = Partial<EditorProps> & {
  layoutItems?: LayoutItemViewModel[];
  widgetFactory?: IWidgetFactory;
  currentFloor?: IStateStack<LayoutViewModelWithState>;
  currentLayout?: LayoutViewModel;
  value?: any;
  field?: string;
  operator?: any;
  form?: WrappedFormUtils<any>;
};

const ConditionEditor = (props: ConditionEditorProps) => {
  const {
    layoutItems,
    widgetFactory,
    currentLayout,
    value,
    operator,
    field,
    form,
  } = props;

  const Conditions = ComplexValidationConditions();
  const [fieldVal, setField] = React.useState<string>(field);
  const [operatorVal, setOperatorVal] = React.useState(operator);
  const [consditionList, setConditionList] =
    React.useState<ILayoutItemComplexValidation>();
  const [WidgetComponent, setWidgetComponent] =
    React.useState<{ Widget: ReactElementType; extraProps: object }>(null);
  const [fieldConditionList, setFieldConditionList] = React.useState([]);
  const [operandKey, setOperandKey] = React.useState(Math.random().toString());
  const fieldItemList: SelectItem[] = layoutItems
    .filter(
      (item) =>
        item.Type !== LayoutItemType.NoneBindable &&
        item.Type !== LayoutItemType.SubLayout
    )
    .map((item: LayoutItemViewModel) => {
      switch (item.Type) {
        case LayoutItemType.Column:
          return {
            value: item.Guid,
            key: JSON.parse(item.Design).Label,
            group: translate("DDMFields"),
          } as SelectItem;

        case LayoutItemType.Reference:
        case LayoutItemType.SubLayout:
          return {
            value: item.Guid,
            key: JSON.parse(item.Design).Label,
            group: translate("DDMRelations"),
          } as SelectItem;

        default:
          break;
      }
    });

  const getLayoutComponentWidget = (params: {
    layoutItem: LayoutItemViewModel;
    viewModelDataType: any;
    conditionType: ValidationCondition;
  }): { Widget: ReactElementType; extraProps: object } => {
    const { layoutItem, conditionType, viewModelDataType } = params;
    const RelationViewModel = widgetFactory.getDetailOfDataModel(
      layoutItem
    ) as unknown;
    if (
      conditionType.operator !== ConditionType.HasValue &&
      conditionType.operator !== ConditionType.HasNotValue
    ) {
      switch (layoutItem.Type) {
        case LayoutItemType.Column:
          if (
            (conditionType.dataType as ColumnDataType) === viewModelDataType
          ) {
            const OperatorWidget = widgetFactory.getComponentByMode(
              fieldVal,
              WidgetType.EditWidget
            )
            return {
              Widget: (
                OperatorWidget.component as IWidget
              ).component,
              extraProps: { ...OperatorWidget.setting },
            };
          }

          return {
            Widget: conditionType.Widget,
            extraProps: { mode: "render", ...conditionType.extraProps },
          };

        case LayoutItemType.Reference:
          if (
            (conditionType.dataType as IRelationConditionDataType).Type ===
            (viewModelDataType as RelationType)
          ) {
            const OperatorWidget = widgetFactory.getComponentByMode(
              fieldVal,
              WidgetType.EditWidget
            );

            return {
              Widget: (OperatorWidget.component as IWidget).component,
              extraProps: {
                ...OperatorWidget.setting,
                mode: "render",
                initValue: {
                  metadata: {
                    ColumnGuids: (layoutItem as LayoutItemReferenceViewModel)
                      .ColumnGuids,
                    DataModelGuid: (RelationViewModel as RelationViewModel)
                      .ReferenceDataModelGuid,
                  },
                },
              },
            };
          }

          return {
            Widget: conditionType.Widget,
            extraProps: { mode: "render", ...conditionType.extraProps },
          };
        default:
          return null;
      }
    } else {
      return null;
    }
  };

  const OnChangefieldItemHandler = (field: string) => {
    setOperandKey(Math.random().toString());
    const { form } = props;
    form.setFieldsValue({ conditionOperator: null, [operandKey]: undefined });

    setField(field.toString());
    setWidgetComponent(null);

    const selectedLayoutItem = layoutItems.find(
      (item) => item.Guid.toLowerCase() === field.toString().toLowerCase()
    );

    switch (selectedLayoutItem.Type) {
      case LayoutItemType.Column:
        const columnViewModel: ColumnViewModel =
          widgetFactory.getDetailOfDataModel(
            selectedLayoutItem
          ) as ColumnViewModel;

        const columnOperator = Conditions.GetFieldComplexCondition({
          layoutItem: selectedLayoutItem,
          viewModel: columnViewModel,
        });

        const columnOperatorList: SelectItem[] =
          columnOperator.ConditionTypes.map((cond) => {
            return {
              value: cond.operator,
              key: translate(
                $enum(ConditionType).getKeyOrDefault(cond.operator)
              ),
            };
          });

        setConditionList(columnOperator);
        setFieldConditionList(columnOperatorList);

        break;
      case LayoutItemType.Reference:
        const RelationViewModel: RelationViewModel =
          widgetFactory.getDetailOfDataModel(
            selectedLayoutItem
          ) as RelationViewModel;

        const relationOperator = Conditions.GetFieldComplexCondition({
          layoutItem: selectedLayoutItem,
          viewModel: RelationViewModel,
          configeProps: {
            initValue: {
              metadata: {
                ColumnGuids: (
                  selectedLayoutItem as LayoutItemReferenceViewModel
                ).ColumnGuids,
                DataModelGuid: RelationViewModel.ReferenceDataModelGuid,
              },
            },
          },
        });

        const relationOperatorList: SelectItem[] =
          relationOperator.ConditionTypes.map((cond) => {
            return {
              value: cond.operator,
              key: translate(
                $enum(ConditionType).getKeyOrDefault(cond.operator)
              ),
            };
          });

        setConditionList(relationOperator);
        setFieldConditionList(relationOperatorList);

        break;
      case LayoutItemType.SubLayout:
        break;
      default:
        break;
    }
  };

  const onChangeOperatorHandler = (operator) => {
    const { form } = props;
    setOperatorVal(operator);
    const newOperandKey = Math.random().toString();
    setWidgetComponent(null);
    setOperandKey(newOperandKey);
    form.setFieldsValue({ [newOperandKey]: undefined });

    const conditionType = consditionList.ConditionTypes.find(
      (cond) => cond.operator === operator
    );
    const selectedLayoutItem = layoutItems.find(
      (item) => item.Guid.toLowerCase() === fieldVal.toString().toLowerCase()
    );
    const viewModel = widgetFactory.getDetailOfDataModel(selectedLayoutItem);

    let viewModelDataType;
    switch (selectedLayoutItem.Type) {
      case LayoutItemType.Column:
        viewModelDataType = (viewModel as ColumnViewModel).DataType;
        setWidgetComponent(
          getLayoutComponentWidget({
            layoutItem: selectedLayoutItem,
            conditionType,
            viewModelDataType,
          })
        );
        break;

      case LayoutItemType.Reference:
        viewModelDataType = (viewModel as RelationViewModel).Type;
        setWidgetComponent(
          getLayoutComponentWidget({
            layoutItem: selectedLayoutItem,
            conditionType,
            viewModelDataType,
          })
        );
        break;
        
      default:
        setWidgetComponent(null);
        break;
    }

  };

  React.useEffect(() => {
    if (field != null) {
      const selectedLayoutItem = layoutItems.find(
        (item) => item.Guid.toLowerCase() === field.toString().toLowerCase()
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

          const columnConditionList: SelectItem[] =
            allColumnFieldOperator.ConditionTypes.map((cond) => {
              return {
                value: cond.operator,
                key: translate(
                  $enum(ConditionType).getKeyOrDefault(cond.operator)
                ),
              };
            });

          setConditionList(allColumnFieldOperator);
          setFieldConditionList(columnConditionList);

          const tempFieldConditionCol =
            allColumnFieldOperator.ConditionTypes.find(
              (cond) => cond.operator === operator
            );

          setWidgetComponent(
            getLayoutComponentWidget({
              layoutItem: selectedLayoutItem,
              conditionType: tempFieldConditionCol,
              viewModelDataType: (columnViewModel as ColumnViewModel).DataType,
            })
          );

          break;
        case LayoutItemType.Reference:
          const RelationViewModel: RelationViewModel =
            widgetFactory.getDetailOfDataModel(
              selectedLayoutItem
            ) as RelationViewModel;

          const allRelationFieldOperator = Conditions.GetFieldComplexCondition({
            layoutItem: selectedLayoutItem,
            viewModel: RelationViewModel,
            configeProps: {
              initValue: {
                metadata: {
                  ColumnGuids: (
                    selectedLayoutItem as LayoutItemReferenceViewModel
                  ).ColumnGuids,
                  DataModelGuid: RelationViewModel.ReferenceDataModelGuid,
                },
              },
            },
          });

          const relationOperatorList: SelectItem[] =
            allRelationFieldOperator.ConditionTypes.map((cond) => {
              return {
                value: cond.operator,
                key: translate(
                  $enum(ConditionType).getKeyOrDefault(cond.operator)
                ),
              };
            });

          setConditionList(allRelationFieldOperator);
          setFieldConditionList(relationOperatorList);

          const tempFieldConditionRel =
            allRelationFieldOperator.ConditionTypes.find(
              (cond) => cond.operator === operator
            );

          setWidgetComponent(
            getLayoutComponentWidget({
              layoutItem: selectedLayoutItem,
              conditionType: tempFieldConditionRel,
              viewModelDataType: (RelationViewModel as RelationViewModel).Type,
            })
          );

          break;
        default:
          break;
      }
    }
  }, []);

  const getValue = (value: any) => {
    const selectedLayoutItem: LayoutItemViewModel = layoutItems.find(
      (item) => item.Guid.toLowerCase() === fieldVal.toLowerCase()
    );
    const conditionType = consditionList.ConditionTypes.find(
      (cond) => cond.operator === operatorVal
    );

    const viewModel: RelationViewModel | ColumnViewModel = widgetFactory.getDetailOfDataModel(selectedLayoutItem);

    return ConditionValueByLayoutItemType({ conditionType: conditionType.operator, value, viewModel, layoutItemType: selectedLayoutItem.Type, convertorMode: ConvertorMode.ToSave })
  };

  const getinitialValue = (value: any, layoutItemGuid: string) => {
    const selectedLayoutItem: LayoutItemViewModel = layoutItems.find(
      (item) => item.Guid.toLowerCase() === layoutItemGuid.toLowerCase()
    );
    const viewModel: RelationViewModel | ColumnViewModel = widgetFactory.getDetailOfDataModel(selectedLayoutItem);
    const conditionType = consditionList.ConditionTypes.find(
      (cond) => cond.operator === operatorVal
    );

    return ConditionValueByLayoutItemType({ conditionType: conditionType.operator, value, layoutItemType: selectedLayoutItem.Type, viewModel, convertorMode: ConvertorMode.ToComponent });
  };

  const handleSubmit = () => {
    const { form } = props;

    form.validateFields((errors, values) => {
      if (!errors) {
        props.onSubmit(
          {
            field: fieldVal,
            operator: form.getFieldValue("conditionOperator"),
            value: getValue(form.getFieldValue(operandKey)),
          },
          `Will render in ViewRenderer component`
        );
      }
    });
  };

  return (
    <div className="query-builder-editor" style={{ width: "500px" }}>
      <Row>
        <Col lg={6} md={8} className="col-condition">
          <SelectEx
            dataSource={fieldItemList}
            value={fieldVal}
            onChange={(value) => OnChangefieldItemHandler(value.toString())}
            style={{ width: "100%", marginLeft: "10px" }}
            dropdownMatchSelectWidth
            disabled={field == null ? false : true}
          />
        </Col>
        <Col lg={6} md={8} className="col-condition">
          {form.getFieldDecorator("conditionOperator", {
            initialValue: operator,
          })(
            <SelectEx
              dataSource={fieldConditionList}
              onChange={onChangeOperatorHandler}
              style={{ width: "100%", marginLeft: "10px" }}
              dropdownMatchSelectWidth
            />
          )}
        </Col>
        <Col lg={6} md={8} className="col-condition">
          {WidgetComponent != null && (
            <FieldItem
              label={""}
              labelCol={{
                span: 0,
              }}
              wrapperCol={{
                span: 24,
              }}
            >
              {form.getFieldDecorator(operandKey, {
                initialValue: getinitialValue(value, fieldVal),
                rules: [{ required: true, message: translate("Required") }],
              })(
                <WidgetComponent.Widget
                  {...WidgetComponent.extraProps}
                  mode={"render"}
                />
              )}
            </FieldItem>
          )}
        </Col>
        <Col lg={6} md={24}>
          <Button icon="check" onClick={handleSubmit}></Button>
          <Button icon="close" onClick={props.onCancel}></Button>
        </Col>
      </Row>
    </div>
  );
};

export default Form.create()(ConditionEditor);

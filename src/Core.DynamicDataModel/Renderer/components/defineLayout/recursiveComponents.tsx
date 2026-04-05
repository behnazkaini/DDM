import * as React from "react";
import { Col, DidgahContextProps, Form, FormComponentProps, Row, WrappedFormUtils } from "didgah/ant-core-component";
import { GroupItem, RowItem, ColumnItem, EmptyItem, ComponentModel, LayoutItemColumnSetting, SubLayoutItemDesignerViewModel, DataSetup, ActionReferenceArchiveProps, LayoutViewModelWithState } from "../../../../typings/Core.DynamicDataModel/Types";
import { ArrangementType, WidgetType } from "../../../../typings/Core.DynamicDataModel/Enums";
import { WidgetFactory } from "../../../Widget/WidgetFactory";
import LayoutManager from "../../../LayoutManager";
import { LayoutViewModel } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.LayoutViewModel";
import { LayoutType } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.LayoutType";
import DefineArchiveLayout from "../defineArchiveLayout/defineArchiveLayout";
import ArchiveLayout from "../archiveLayout/archiveLayout";
import InlineArchiveLayout from "../inlineArchiveLayout/inlineArchiveLayout";
import { IWidgetFactory, ISetupData } from '../../../../typings/Core.DynamicDataModel/Types';
import { LayoutItemViewModel } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.LayoutItemViewModel";
import { LayoutItemType } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.LayoutItemType";
import { LayoutValueResponseViewModel } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.LayoutValueResponseViewModel";
import { WebSoftwareComponentViewModel } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.WebSoftwareComponentViewModel";
import { LayoutValueByPrimaryKeyResponseViewModel } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.LayoutValueByPrimaryKeyResponseViewModel";
import { guid, utility, DidgahClientJS } from 'didgah/common';

import defineLayoutResolver from "./defineLayoutResolver";
import { translate } from 'didgah/common';
import { KeyValueViewModel } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.KeyValueViewModel";
import { findPrimaryKeys, hasKeyInStructure } from "./helper";
import { FormApiType } from "../useWrapperLayout";
import { FormStore, useFormStore } from "../../store/FormValuesStore";

export const layoutComponent = {
  [LayoutType.Define]: defineLayoutResolver,
  [LayoutType.Archive]: ArchiveLayout,
  [LayoutType.DefineArchive]: DefineArchiveLayout,
  [LayoutType.InlineArchive]: InlineArchiveLayout
}
interface RecursiveComponenttProps {
  design: GroupItem | RowItem | ColumnItem | EmptyItem;
  widgetFactory: IWidgetFactory;
  dataSetup?: ISetupData;
  layoutManager: LayoutManager;
  variables: KeyValueViewModel<string, Object>[],
  currentLayout: LayoutViewModel;
  mode?: 'add' | 'edit';
  primaryKey?: string;
  getComponent?: (layoutItemGuid: string) => ComponentModel;
  onGetSavedData: (fn) => void;
  onChange?: (value?, layoutItemGuid?) => void;
  form: WrappedFormUtils<any>;
  widgetsMode?: WidgetType;
  previewInitialDataForDesigner?: LayoutValueResponseViewModel;
  webSoftwareComponents: Array<WebSoftwareComponentViewModel>;
  context: DidgahContextProps;
  layoutComponents?: { element: JSX.Element };
  setChangedLayoutItemGuid: (layoutItemGuid: string) => void;
  getChangedLayoutItemGuid: () => string[];
  isSimpleDesignerMode: boolean;
  formApi?: FormApiType;
  store: FormStore;
}

function ColumnContainer(props) {
  return <Col md={props.Col * 2} xs={props.Col * 2}>{Array.isArray(props.children) ? [...props.children] : props.children}</Col>;
}

function RecursiveComponents({ formApi, variables, form, onChange, setChangedLayoutItemGuid, getChangedLayoutItemGuid, widgetsMode, mode, primaryKey, design, onGetSavedData, widgetFactory, getComponent, dataSetup, layoutManager, currentLayout, previewInitialDataForDesigner, webSoftwareComponents, context, layoutComponents, isSimpleDesignerMode, store }: RecursiveComponenttProps) {
  const typeCounterTime = React.useRef(null);
  const fieldMeta = useFormStore(store, state => state.fieldMeta);
  function getFormLayoutSize(setting: LayoutItemColumnSetting) {
    const { LabelMutable, WrapperCol, WrapperLabel } = setting;
    return {
      labelCol: { span: LabelMutable ? WrapperLabel : 4 },
      wrapperCol: { span: LabelMutable ? WrapperCol : 20 },
    };
  }

  function getWidget(layoutItemGuid: string) {
    const componentData = getComponent(layoutItemGuid);
    let data: ComponentModel = {
      component: (componentData.component as any)?.component,
      rule: componentData.rule,
      setting: componentData.setting,
      dataModelSetting: componentData.dataModelSetting
    }
    return data;
  }

  const resetForm = (data: any) => {
    const errors = form.getFieldError(data.rowKey);
    if (errors?.length) {
      const value = form.getFieldValue(data.rowKey);
      form.resetFields([data.rowKey]);
      form.setFieldsValue({ [data.rowKey]: value ?? undefined });
    }
  };

  function setDisabeldFormItem(_layoutItemGuid: string, data: any): boolean | undefined {
    return fieldMeta[data?.rowKey]?.disabled;
  }

  function setRequiredRuleByAction(_layoutItemGuid: string, data: any): any {
    if (fieldMeta[data?.rowKey]?.required) {
      return { required: true, message: translate('Required') };
    }
    return undefined;
  }

  function handleChange(value: any, layoutItemGuid: string, data: DataSetup) {
    setChangedLayoutItemGuid(layoutItemGuid);
    store.getState().setField(data.rowKey, value);
  }

  function handleChangeSublayout(value: any, _tableHandler: ActionReferenceArchiveProps, layoutItemGuid: string, data: DataSetup, _subLayoutDataSetup: ISetupData) {
    setChangedLayoutItemGuid(layoutItemGuid);
    // value is the rows array returned by tableActionHandler.getData()
    store.getState().setGrid(data.rowKey, value);
  }

  function getPrimaryKeyForDefineSublayout(rowKey: string) {
    const initialData: LayoutValueByPrimaryKeyResponseViewModel = (dataSetup as any)?.initialData;
    const layoutItemRow = initialData.Row?.KeyValues?.find(x => x.Key === rowKey);
    if (layoutItemRow) {
      return layoutItemRow.Value[0]?.PrimaryKey ?? guid.newGuid();
    }
    return guid.newGuid();
  }

  function getRowData(subLayoutItem: LayoutItemViewModel, layoutRelatedSubLayout: LayoutViewModelWithState) {

    const findRow = () => {
      return dataSetup.data.find(x => x.layoutItemGuid === subLayoutItem.Guid).row
    }

    return previewInitialDataForDesigner ? null : (
      layoutRelatedSubLayout.Type === LayoutType.Define ?
        { Row: (Array.isArray(findRow()?.Value) ? findRow().Value[0] : undefined) } :
        { Rows: findRow()?.Value }
    );
  }

  function getComponentInCol(design: ColumnItem, form, primaryKey: string) {
    const colIsNotEmpty = !!design.LayoutItemGuid;
    if (colIsNotEmpty) {
      const data = dataSetup.data.find(x => x.layoutItemGuid === design.LayoutItemGuid);
      switch (design.Type) {
        case ArrangementType.SubLayout: {
          const subLayoutItem = currentLayout.Items.find((item) => item.Guid.toLowerCase() === design.LayoutItemGuid.toLowerCase());
          const layoutRelatedSubLayout = layoutManager.getCurrentLayout({ layouts: layoutManager.layouts, currentLayoutGuid: (subLayoutItem as SubLayoutItemDesignerViewModel).SubLayoutGuid });
          const Component = layoutComponents ? layoutComponents[layoutRelatedSubLayout.Type] : null;
          const componentProps = {
            onChange: (value, tableHandler, subLayoutDataSetup) => handleChangeSublayout(value, tableHandler, design.LayoutItemGuid.toLowerCase(), data, subLayoutDataSetup),
          };
          return (
            <>
              {!!Component && (
                <Component
                  {...componentProps}
                  layoutGuid={layoutRelatedSubLayout.Guid}
                  dataModelGuid={layoutRelatedSubLayout.DataModelGuid}
                  dataModels={widgetFactory.dataModels}
                  mode={mode}
                  primaryKey={layoutRelatedSubLayout.Type === LayoutType.Define ? getPrimaryKeyForDefineSublayout(data.rowKey) : primaryKey}
                  hasParent={true}
                  parentInitialData={{
                    DataModels: widgetFactory.dataModels,
                    Layouts: widgetFactory.layouts,
                    Guid: currentLayout.Guid,
                    ...getRowData(subLayoutItem, layoutRelatedSubLayout)
                  }}
                  inLoadableMode={true}
                  onGetSavedData={onGetSavedData}
                  widgetsMode={widgetsMode}
                  previewInitialDataForDesigner={previewInitialDataForDesigner}
                  webSoftwareComponents={webSoftwareComponents}
                  layoutComponents={layoutComponents}
                  context={context}
                  isSimpleDesignerMode={isSimpleDesignerMode} /* Read this property from props */
                />
              )}
            </>
          );
        }
        case ArrangementType.Shape: {
          const componentData: ComponentModel = getWidget(design.LayoutItemGuid);
          const ComponentElement = componentData.component as any;
          const componentProps = {
            ...componentData.setting as LayoutItemColumnSetting,
            mode: 'render',
          };
          return (
            <>

              {!!ComponentElement && (
                <Form.Item {...getFormLayoutSize(componentData.setting)} label={componentProps.Label}>
                  {form.getFieldDecorator(data.rowKey,
                  )
                    (<ComponentElement {...componentProps}></ComponentElement>)}
                </Form.Item>
              )}
            </>
          );
        }


        default: {

          const componentData: ComponentModel = getWidget(design.LayoutItemGuid);
          const ComponentElement = componentData.component as any;
          const inputVariableType = widgetFactory.dataModels.find(d => d.Guid === data.dataModelGuid)?.InputVariableType;

          const computeDefaultVariableValue = () => {
            const variableGuid: string = data.variableGuid;
            if (!variableGuid) return undefined;

            const { DataModels } = dataSetup.initialData;
            const allVariables = DataModels.flatMap(dm => dm.Variables);
            const variable = allVariables.find(v => v.Guid === variableGuid);

            const referenceGuid = variable?.ReferenceGuid;
            if (!referenceGuid) return undefined;

            if (!form.getFieldsValue().hasOwnProperty(referenceGuid)) {
              return variables?.find(v => v.Key === variableGuid)?.Value as string;
            }
            else {
              const formKey: string = form.getFieldValue(referenceGuid)?.key;

              if (!formKey) return undefined;
              else return formKey
            }
          }

          const getVariableValue = async () => {
            const { DataModels } = dataSetup.initialData;
            const allRelations = DataModels.flatMap(dm => dm.Relations);
            const finded = allRelations.find(r => r.ReferenceDataModelGuid === inputVariableType.Guids[0]);
            const formData = await formApi.getSavedDataWithoutValidation()
            const KeyValues = formData?.flatMap(r => r.KeyValues);
            let primaryKey = computeDefaultVariableValue();

            if (KeyValues && hasKeyInStructure(KeyValues, finded.Guid)) {
              primaryKey = findPrimaryKeys(KeyValues, finded.Guid)[0];
            }
            return primaryKey
          }

          const getVariableHelp = () => {
            const variableGuid: string = data.variableGuid;
            if (!variableGuid) return undefined;
            const { DataModels } = dataSetup.initialData;
            const allVariables = DataModels.flatMap(dm => dm.Variables);
            const findVariableByGuid = (guid) => allVariables.find(v => v.Guid === guid);
            const variable = findVariableByGuid(variableGuid);
            return `${translate('ThisFiledConnectTo{n}').replace('{n}', variable?.Label)}`
          };


          const getSettings = () => {
            const referenceDataModelGuid: string = data.dataModel?.ReferenceDataModelGuid;

            if (referenceDataModelGuid) {
              const referenceDataModel = widgetFactory.dataModels.find(d => d.Guid === referenceDataModelGuid);
              const settings = referenceDataModel?.Settings?.map(setting => {
                const match = data.dataModel.Settings?.find(r => r.Guid === setting.Guid);
                return {
                  ...setting,
                  ...(match ? { Value: match.Value } : {}),
                };
              });
              return settings;
            }
          };

          const componentProps: any = {
            ...componentData.setting as LayoutItemColumnSetting,
            initValue: data?.formData,
            settings: getSettings(),
            mode: 'render',
            primaryKey,
            dataModelGuid: currentLayout.DataModelGuid,
            Disabled: setDisabeldFormItem(design.LayoutItemGuid, data) ?? (componentData.setting as LayoutItemColumnSetting).Disabled,
            validationRules: { ...componentData.rule, ...(componentData as ComponentModel).dataModelSetting },
            onChange: (e) => handleChange(e, design.LayoutItemGuid, data),
            help: (componentData.setting as LayoutItemColumnSetting)?.HelpTooltip ?? getVariableHelp(),
            dataModels: widgetFactory.dataModels,
            resetForm: () => { resetForm(data) },
            inputVariableType: inputVariableType,
            onGetVariableValue: formApi ? getVariableValue : undefined
          };

          const requiredRuleByAction = setRequiredRuleByAction(design.LayoutItemGuid, data);
          const getRules = () => {
            if (!requiredRuleByAction) {
              return componentData.rule;
            }
            else {
              return componentData?.rule?.length ? ([...componentData.rule, requiredRuleByAction]) : [requiredRuleByAction];
            }
          }

          let rules = !!componentData?.rule || !!requiredRuleByAction ? getRules() : undefined;
          if (!rules) {
            rules = [{
              validator: (rule, value, callback) => callback()
            }]
          }//Don't delete this code, For handling operationOnEvenets, rule cannot be undefined and then set
          return (
            <>
              {!!ComponentElement && !!data && (
                <Form.Item {...getFormLayoutSize(componentData.setting)} label={componentProps.Label} help={componentProps.help}>
                  {form.getFieldDecorator(data.rowKey,
                    { initialValue: (data.hasOwnProperty('formItemInitialValue') && !data.formItemInitialValue) ? data.formItemInitialValue : data.formData, rules })
                    (<ComponentElement {...componentProps} rules={rules}></ComponentElement>)}
                </Form.Item>
              )}
            </>
          );
        }
      }
    }

    return;
  }

  let designItemsChildren = [];
  let ComponentElement;
  let componentSetting;

  switch (design.Type) {
    case ArrangementType.NoneBindableGroup:
      {
        designItemsChildren = (design as GroupItem).Children;
        const componentData = getWidget(design.LayoutItemGuid);
        componentSetting = componentData.setting;
        ComponentElement = componentData.component;
        break;
      }
    case ArrangementType.Row:
      designItemsChildren = (design as RowItem).Columns;
      ComponentElement = Row;
      break;
    case ArrangementType.Shape: {
      designItemsChildren = [];
      componentSetting = design;
      ComponentElement = ColumnContainer;
      break;
    }
    case ArrangementType.Column:
    case ArrangementType.Empty:
    case ArrangementType.SubLayout:

      designItemsChildren = [];
      componentSetting = design;
      ComponentElement = ColumnContainer;
      break;
  }

  const hasChildren = !!designItemsChildren.length;
  return (
    <ComponentElement {...componentSetting}>
      {hasChildren
        ? designItemsChildren.map((child) => (
          <RecursiveComponents
            design={child}
            dataSetup={dataSetup}
            widgetFactory={widgetFactory}
            form={form}
            mode={mode}
            variables={variables}
            layoutManager={layoutManager}
            currentLayout={currentLayout}
            onGetSavedData={onGetSavedData}
            getComponent={getComponent}
            widgetsMode={widgetsMode}
            previewInitialDataForDesigner={previewInitialDataForDesigner}
            webSoftwareComponents={webSoftwareComponents}
            context={context}
            primaryKey={primaryKey}
            layoutComponents={layoutComponents}
            setChangedLayoutItemGuid={setChangedLayoutItemGuid}
            getChangedLayoutItemGuid={getChangedLayoutItemGuid}
            isSimpleDesignerMode={isSimpleDesignerMode}
            formApi={formApi}
            store={store}
          />
        ))
        : getComponentInCol(design as ColumnItem, form, primaryKey)

      }
    </ComponentElement>
  )
}

export default RecursiveComponents
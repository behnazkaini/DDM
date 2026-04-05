import {
  CommonSetting,
  FieldTypesWidget,
  ReferenceTypeWidget,
  ReferenceTypeWidgetProxy,
  Setting,
  WidgetSettingMap,
} from "../../TS/Widgets";
import {
  Button,
  Form,
  WrappedFormUtils,
  Radio,
  Select,
  SelectValue,
  Input,
  SelectEx,
  SelectItem,
} from "didgah/ant-core-component";
import React, { useEffect, useState } from "react";
import { LayoutItemType } from "../../../Models/Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.LayoutItemType";
import {
  BaseLayoutItemSetting,
  LayoutItemColumnSetting,
  LayoutItemDesignerViewModel,
  LayoutItemNoneBindableSetting,
  LayoutItemReferenceDesignerViewModel,
  LayoutItemReferenceSetting,
  RangeValidationSetting,
  RichLayoutItem,
  SettingType,
  WidgetId,
} from "../../../typings/Core.DynamicDataModel/Types";
import Label from "../components/settingForm/Label";
import DefaultStaff from "../components/settingForm/DefaultStaff";
import Direction from "../components/settingForm/Direction";
import HelpTooltip from "../components/settingForm/HelpTooltip";
import LabelMutable from "../components/settingForm/LabelMutable";
import ItemList from "../components/settingForm/ItemList";
import HelpBlockSetting from "../components/settingForm/HelpBlock";
import TimeDefaultValue from "../components/settingForm/TimeDefaultValue";
import DateDefaultValue from "../components/settingForm/DateDefaultValue";
import DateTimeDefaultValue from "../components/settingForm/DateTimeDefaultValue";
import ReferenceAutoCompleteColumns from "../components/settingForm/ReferenceAutoCompleteColumns";
import RefrenceTokenContainerColumns from "../components/settingForm/ReferenceTokenContainerColumns";
import { LayoutItemViewModel } from "../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.LayoutItemViewModel";
import { translate } from "../../../Utility/language";
import { DataModelViewModel } from "../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.DataModelViewModel";
import { ColumnViewModel } from "../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.ColumnViewModel";
import { RelationViewModel } from "../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.RelationViewModel";
import { LayoutType } from "../../../Models/Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.LayoutType";
import { DesignerItemType, WidgetType } from "../../../typings/Core.DynamicDataModel/Enums";
import ValidationAssistant, { getDefaultDataTypeSetting } from "../../TS/Validations";
import { ValidationViewModel } from "../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.ValidationViewModel";
import { ValidationType } from "../../../Models/Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.ValidationType";
import { utility } from "didgah/common";
import { getSoftwareModelItem } from "./widgetManager";
import { WebSoftwareComponentViewModel } from "../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.WebSoftwareComponentViewModel";
import { IWebSoftwareViewModel } from "../../SoftwareModels/Staff/types";
import CascadeDropDownLevelSetting from "../components/settingForm/CascadeDropDownLevelSetting";
import CascadeDropDownColumnSetting from "../components/settingForm/CascadeDropDownColumnSetting";
import { DataModelType } from "../../../Models/Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.DataModelType";
import useFloorStack from "../hooks/useFloorStack";
import { convertDesignerVersion2WidgetTypeToDataType } from "../../../Core.DynamicDataModel/Widget/WidgetFactory";
import ReferenceProperties from "../../SimpleDesigner/components/ReferenceProperties";
import SimpleDesignerColumnProperties, { createEmptyDDMColumn, createEmptyDDMTable } from "../../../Core.DynamicDataModel/SimpleDesigner/components/SimpleDesignerColumnProperties";
import { AddDataModelVariableViewModel } from "../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.DataModel.AddDataModelVariableViewModel";
import { RelationNature } from "../../../Models/Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.RelationNature";
import { RelationType } from "../../../Models/Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.RelationType";
import ReferenceCheckBoxListColumns from "../components/settingForm/referenceCheckBoxListColumns/ReferenceCheckBoxListColumns";
import ReferenceRadioButtonColumns from "../components/settingForm/referenceRadioButtonColumns/ReferenceCheckBoxListColumns";

const RadioGroup = Radio.Group;
const FormRow = Form.Row;
const Option = Select.Option;

interface SettingsFormItemRendererProps {
  settingName: string;
  form: WrappedFormUtils<any>;
  initialSettingValues: any;
  dataModel: DataModelViewModel;
  onSave: () => void;
  key: string;
  viewModel: RelationViewModel | ColumnViewModel;
  layoutItem: LayoutItemViewModel;
  isSimpleDesignerMode: boolean;
}

export const SettingsFormItemRenderer = (
  props?: SettingsFormItemRendererProps
) => {
  const { settingName, form, initialSettingValues, dataModel, onSave, key, viewModel, layoutItem, isSimpleDesignerMode } = props;

  switch (settingName) {
    case Setting.Label:
      return Label({ form, settingName, initialSettingValues, onSave, key });
    case Setting.DefaultStaff:
      return DefaultStaff({ form, settingName, initialSettingValues, onSave, key });
    case Setting.Direction:
      return Direction({ form, settingName, initialSettingValues, onSave, key });
    case Setting.HelpTooltip:
      return HelpTooltip({ form, settingName, initialSettingValues, onSave, key });
    case Setting.LabelMutable:
      return LabelMutable({ form, settingName, initialSettingValues, onSave, key });
    case Setting.WrapperCol:
    case Setting.WrapperLabel:
      break;
    case Setting.ItemList:
      return ItemList({ form, settingName, initialSettingValues, onSave, key, viewModel });
    case Setting.HelpBlock:
      return HelpBlockSetting({
        form,
        settingName,
        initialSettingValues,
        onSave,
        key
      });
    case Setting.DefaultValueTime:
      return TimeDefaultValue({
        form,
        settingName,
        initialSettingValues,
        onSave,
        key
      });
    case Setting.DefaultValueDate:
      return DateDefaultValue({
        form,
        settingName,
        initialSettingValues,
        onSave,
        key
      });
    case Setting.DefaultValueDateTime:
      return DateTimeDefaultValue({
        form,
        settingName,
        initialSettingValues,
        onSave,
        key
      });
    case Setting.ReferenceAutoCompleteColumnsConfige:
      return ReferenceAutoCompleteColumns({
        form,
        settingName,
        initialSettingValues,
        dataModel,
        onSave,
        key,
        viewModel,
        layoutItem,
        isSimpleDesignerMode
      });
    case Setting.ReferenceTokenContainerColumnsConfige:
      return RefrenceTokenContainerColumns({
        form,
        settingName,
        initialSettingValues,
        dataModel,
        onSave,
        key,
        viewModel,
        layoutItem,
        isSimpleDesignerMode
      });
    case Setting.CascadeDropDownLevel:
      return CascadeDropDownLevelSetting({
        form,
        settingName,
        initialSettingValues,
        dataModel: isSimpleDesignerMode ? { Guid: (layoutItem as RichLayoutItem).simpleDesignerData.DataModelInfo.ReferenceDataModelGuid } as any : dataModel,
        onSave,
        key
      });
    case Setting.CascadeDropdownSelectedColumns:
      return CascadeDropDownColumnSetting({
        form,
        settingName,
        initialSettingValues,
        dataModel: isSimpleDesignerMode ? { Guid: (layoutItem as RichLayoutItem).simpleDesignerData.DataModelInfo.ReferenceDataModelGuid } as any : dataModel,
        onSave,
        key
      });
    case Setting.ReferenceCheckBoxListColumnsConfig:
      return ReferenceCheckBoxListColumns({
        form,
        settingName,
        initialSettingValues,
        dataModel,
        onSave,
        key,
        viewModel,
        layoutItem,
        isSimpleDesignerMode
      });
    case Setting.ReferenceRadioButtonColumnsConfig:
      return ReferenceRadioButtonColumns({
        form,
        settingName,
        initialSettingValues,
        dataModel,
        onSave,
        key,
        viewModel,
        layoutItem,
        isSimpleDesignerMode
      });

    default:
      return Label({ form, settingName, initialSettingValues, onSave, key });
  }
};

interface SimpleValidationColumnItemRendererProps {
  viewModel: ColumnViewModel;
  layoutItem: LayoutItemDesignerViewModel;
  form: WrappedFormUtils<any>;
  layoutValidationRules: ValidationViewModel[];
  onClickSave: () => void;
  isSimpleDesignerMode: boolean;
}

const SimpleValidationColumnItemRenderer = (
  props: SimpleValidationColumnItemRendererProps
) => {
  const { viewModel, layoutItem, form, layoutValidationRules, onClickSave, isSimpleDesignerMode } =
    props;
  const viewModelDataType = (isSimpleDesignerMode && layoutItem.Type === LayoutItemType.Column) ? convertDesignerVersion2WidgetTypeToDataType((layoutItem as RichLayoutItem).simpleDesignerData.simpleDesignerWidgetType) : (viewModel as ColumnViewModel).DataType;

  const validationFactory = ValidationAssistant();
  const ValidationTypesMap = validationFactory.SimpleValidationGenerator({
    viewModel,
    layoutItemType: layoutItem.Type,
    dataType: viewModelDataType
  }).ValidationTypes;

  const [errors, setErrors] = React.useState<string[]>([]);
  const isThereError = errors.length > 0;

  const errorsCallback = (errors: string[]) => {
    if (errors.length == 0) {
      onClickSave();
    }
    setErrors(errors);
  };

  const handleSaveForm = () => {
    if (errors.length > 0) {
      return;
    }
    onClickSave();
  };

  return (
    <>
      {ValidationTypesMap.map((validation) => {
        const layoutItemRuleIndex = layoutValidationRules.findIndex(
          (rule) =>
            rule.Type === validation.type &&
            layoutItem.Guid.toLowerCase() === rule.LayoutItemGuid.toLowerCase()
        );

        const currentValidationRule: ValidationViewModel =
          layoutItemRuleIndex > -1
            ? layoutValidationRules[layoutItemRuleIndex]
            : undefined;
        return (
          <FormRow>
            {validation.widget({
              form,
              dataTypeSetting: (viewModel && viewModel.Setting) ? JSON.parse(viewModel.Setting) : getDefaultDataTypeSetting(viewModelDataType),
              layoutItemDesign: layoutItem.Design,
              viewModelDataType: viewModelDataType,
              initialValue:
                !!currentValidationRule && JSON.parse(currentValidationRule.Setting),
              errorCallback: errorsCallback,
              onSave: handleSaveForm,
            })}
          </FormRow>
        );
      })}

      {isThereError && (
        <ul className="DDM-formsamplevalidation-error-ul">
          {errors.map((error, i) => (
            <li key={i} className="DDM-formsamplevalidation-error-li">
              {error}
            </li>
          ))}
        </ul>
      )}
    </>
  );
};

interface SettingFormGeneratorProps {
  form?: WrappedFormUtils<any>;
  layoutItem: LayoutItemViewModel;
  componentName: string;
  onSaveCallbackHandler: (value: any) => void;
  dataModel: DataModelViewModel;
  layoutType: LayoutType;
  softwareModels: WebSoftwareComponentViewModel[];
  viewModel: RelationViewModel | ColumnViewModel;
  isSimpleDesignerMode: boolean;
}

const SettingFormGenerator = (props: SettingFormGeneratorProps) => {
  const {
    form,
    layoutItem,
    componentName,
    onSaveCallbackHandler,
    dataModel,
    layoutType,
    softwareModels,
    viewModel,
    isSimpleDesignerMode
  } = props;
  let Design: unknown;

  switch (layoutItem.Type) {
    case LayoutItemType.Column:
      Design = JSON.parse(layoutItem.Design) as LayoutItemColumnSetting;

      break;
    case LayoutItemType.NoneBindable:
      Design = JSON.parse(layoutItem.Design) as any;

      break;
    case LayoutItemType.Reference:
      Design = JSON.parse(layoutItem.Design) as LayoutItemReferenceSetting;

      break;
    default:
      Design = null;
  }

  const onSave = () => {
    const timer = window.setTimeout(() => {
      form.validateFields((errors, values) => {
        if (errors == null) {
          onSaveCallbackHandler(values);
        }
      });
      window.clearTimeout(timer);
    }, 100);
  };

  if (layoutItem.Type === LayoutItemType.NoneBindable) {
    return (
      <>
        {(WidgetSettingMap[componentName][layoutType] as Array<string>).map(
          (settingName) => {
            return (
              <FormRow>
                {SettingsFormItemRenderer({
                  key: settingName,
                  settingName,
                  form,
                  dataModel,
                  initialSettingValues: {
                    ...(Design as LayoutItemNoneBindableSetting),
                  },
                  onSave,
                  viewModel,
                  layoutItem,
                  isSimpleDesignerMode
                })}
              </FormRow>
            );
          }
        )}
      </>
    );
  } else if (layoutItem.Type === LayoutItemType.Reference && (componentName.startsWith('StaffSelector'))) {
    const settingLayoutTypeProxy =
      layoutType !== LayoutType.Define ? LayoutType.Archive : layoutType;

    return (
      <>
        {(WidgetSettingMap[componentName] as SettingType)[
          String(settingLayoutTypeProxy)
        ].map((settingName) => {
          return (
            <FormRow>
              {SettingsFormItemRenderer({
                key: settingName,
                settingName,
                form,
                dataModel,
                initialSettingValues: { ...(Design as BaseLayoutItemSetting) },
                onSave,
                viewModel,
                isSimpleDesignerMode,
                layoutItem
              })}
            </FormRow>
          );
        })}
      </>
    );
  } else {
    const settingLayoutTypeProxy =
      layoutType !== LayoutType.Define ? LayoutType.Archive : layoutType;
    let viewModelSoftwareModel;
    if (isSimpleDesignerMode && layoutItem.Type === LayoutItemType.Reference) {
      const referenceDataModelGuid = (layoutItem as RichLayoutItem).simpleDesignerData.DataModelInfo.ReferenceDataModelGuid;
      if (referenceDataModelGuid) {
        viewModelSoftwareModel = getSoftwareModelItem(
          (layoutItem as RichLayoutItem).simpleDesignerData.DataModelInfo.ReferenceDataModelGuid,
          softwareModels)
      }
    } else if (layoutItem.Type === LayoutItemType.Reference) {
      viewModelSoftwareModel = getSoftwareModelItem(
        dataModel.Guid,
        softwareModels)
    }

    if (!!viewModelSoftwareModel) {
      const Model: IWebSoftwareViewModel =
        window[
        "Model" +
        viewModelSoftwareModel.DataModelGuid.replace(
          /\-/gm,
          ""
        ).toLowerCase()
        ];
      const settingProps = {
        form,
        initialSettingValues: { ...(Design as BaseLayoutItemSetting) },
        Widget: (Design as LayoutItemReferenceSetting).Widget,
        EditWidget: (Design as LayoutItemReferenceSetting).EditWidget,
        DisplayWidget: (Design as LayoutItemReferenceSetting).DisplayWidget,
      };

      const commonWidget = CommonSetting.map((settingName) => {
        return SettingsFormItemRenderer({
          key: settingName,
          settingName,
          form,
          initialSettingValues: { ...(Design as BaseLayoutItemSetting) },
          dataModel: null,
          onSave,
          viewModel,
          layoutItem,
          isSimpleDesignerMode
        })
      });
      return (
        <Model.settingFactory layoutType={settingLayoutTypeProxy} componentName={componentName} commonSettingWidget={commonWidget}  {...settingProps} settingMap={Model.widgetSetting} onSettingChanged={onSave} />
      );
      // TODO: Seperate SimpleDesigner settingfactory for simplifying this lines
    } else if (isSimpleDesignerMode && ((layoutItem as RichLayoutItem).simpleDesignerData.relationCandidatesType === DesignerItemType.SoftwareModelAggregation)) {
      return <></>;
    } else if (isSimpleDesignerMode && ((layoutItem as RichLayoutItem).simpleDesignerData.relationCandidatesType === DesignerItemType.PermanentAggregation) && !(layoutItem as RichLayoutItem).simpleDesignerData.DataModelInfo.ReferenceDataModelGuid) {
      return <></>;
    } else {
      const settingLayoutTypeProxyV = componentName === 'CascadeDropdown' ? LayoutType.Define : settingLayoutTypeProxy
      return (
        <>
          {(WidgetSettingMap[componentName] as SettingType)[
            String(settingLayoutTypeProxyV)
          ].map((settingName, index) => {
            return (
              <FormRow key={settingName}>
                <SettingsFormItemRenderer
                  key={settingName}
                  settingName={settingName}
                  form={form}
                  dataModel={dataModel}
                  initialSettingValues={{ ...(Design as BaseLayoutItemSetting) }}
                  onSave={onSave}
                  viewModel={viewModel}
                  layoutItem={layoutItem}
                  isSimpleDesignerMode={isSimpleDesignerMode}
                />
              </FormRow>
            );
          })}
        </>
      );
    }

  }
};

interface WidgetPropertiesGeneratorProps {
  form?: WrappedFormUtils<any>;
  layoutItem: LayoutItemViewModel;
  viewModel: RelationViewModel | ColumnViewModel;
  componentName: string;
  onSaveCallbackHandler: (value: {
    values: BaseLayoutItemSetting;
    isWidgetChanged: boolean;
  }) => void;
  layoutType: LayoutType;
  softwareModels: WebSoftwareComponentViewModel[];
  onChangedSetting: (changed: boolean) => void;
  isSimpleDesignerMode: boolean;
  layoutGuid: string;
}

const WidgetPropertiesGenerator = (props: WidgetPropertiesGeneratorProps) => {
  const {
    form,
    layoutItem,
    componentName,
    onSaveCallbackHandler,
    viewModel,
    layoutType,
    softwareModels,
    onChangedSetting,
    isSimpleDesignerMode,
    layoutGuid
  } = props;
  let oldDesign: BaseLayoutItemSetting;

  let Design:
    | LayoutItemColumnSetting
    | LayoutItemNoneBindableSetting
    | LayoutItemReferenceSetting;

  const [WidgetChanged, setWidgetChanged] = React.useState(false);
  switch (layoutItem.Type) {
    case LayoutItemType.Column:
      Design = JSON.parse(layoutItem.Design) as LayoutItemColumnSetting;
      oldDesign = JSON.parse(layoutItem.Design) as LayoutItemColumnSetting;
      break;
    case LayoutItemType.NoneBindable:
      Design = JSON.parse(layoutItem.Design) as LayoutItemNoneBindableSetting;
      oldDesign = JSON.parse(
        layoutItem.Design
      ) as LayoutItemNoneBindableSetting;
      break;
    case LayoutItemType.Reference:
      Design = JSON.parse(layoutItem.Design) as LayoutItemReferenceSetting;
      oldDesign = JSON.parse(layoutItem.Design) as LayoutItemReferenceSetting;
      break;
    default:
      Design = null;
      oldDesign = null;
  }

  const CheckIschangedWidget = (
    oldDesign: BaseLayoutItemSetting,
    formValue: BaseLayoutItemSetting
  ) => {
    const OldWidget = (oldDesign as LayoutItemColumnSetting).Widget;
    const NewWidget = (formValue as LayoutItemColumnSetting).Widget;
    const OldEditWidget =
      (oldDesign as LayoutItemColumnSetting).EditWidget &&
      (oldDesign as LayoutItemColumnSetting).EditWidget.Id;
    const NewEditWidget =
      (formValue as LayoutItemColumnSetting).EditWidget == null
        ? OldEditWidget
        : (formValue as LayoutItemColumnSetting).EditWidget.Id;
    const OldDisplayWidget = (oldDesign as LayoutItemColumnSetting)
      .DisplayWidget.Id;
    const NewDeiplayWidget = (formValue as LayoutItemColumnSetting)
      .DisplayWidget.Id;

    if (
      OldWidget !== NewWidget ||
      OldEditWidget !== NewEditWidget ||
      OldDisplayWidget !== NewDeiplayWidget
    ) {
      return true;
    } else {
      return false;
    }
  };

  const onChangeHandler = () => {
    form.validateFields((errors, values) => {
      if (errors == null) {
        const isWidgetChanged = CheckIschangedWidget(oldDesign, values);
        if (isSimpleDesignerMode) {
          onSaveCallbackHandler({ values, isWidgetChanged });
        } else {
          setWidgetChanged(isWidgetChanged);
        }
        onChangedSetting(isWidgetChanged);
      }
    });
  };

  const onSave = () => {
    form.validateFields((errors, values) => {
      if (errors == null) {
        const isWidgetChanged = CheckIschangedWidget(oldDesign, values);
        onSaveCallbackHandler({ values, isWidgetChanged });
      }
    });
  };

  //component
  const WidgetList = (props: {
    viewModel: RelationViewModel | ColumnViewModel;
    layoutItemType: LayoutItemType;
    value?: WidgetId;
    form?: WrappedFormUtils<any>;
    onChanged: () => void;
    WidgetType: WidgetType;
    dataType: number;
    layoutGuid: string;
  }) => {
    const { viewModel, layoutItemType, value, onChanged, WidgetType, dataType, layoutGuid } = props;
    const { currentFloor } = useFloorStack({
      layoutGuid,
    });
    const handleOnChange = (e) => {
      form.setFieldsValue({
        [WidgetType]: { Id: e.target.value },
      });
      onChanged();
    };

    switch (layoutItemType) {
      case LayoutItemType.Column:
        const fieldWidgets = FieldTypesWidget[dataType.toString()][WidgetType];
        return (
          <RadioGroup onChange={handleOnChange} value={value && Number(value.Id)}>
            {Object.keys(fieldWidgets).map((widgetId) => (
              <Radio
                key={Math.random()}
                style={{ display: "block" }}
                value={Number.parseInt(widgetId)}
              >
                {translate(
                  FieldTypesWidget[
                  dataType.toString()
                  ][WidgetType][widgetId]
                )}
              </Radio>
            ))}
          </RadioGroup>
        );
      case LayoutItemType.Reference:
        let Widgets = null;
        let referenceDataModelType;
        if (isSimpleDesignerMode) {
          referenceDataModelType = (layoutItem as RichLayoutItem).simpleDesignerData.DataModelInfo.ReferenceDataModelType;
        } else {
          referenceDataModelType = currentFloor.LayoutModels.DataModels.find(d => d.Guid === (viewModel as RelationViewModel).ReferenceDataModelGuid).Type;
        }

        if (isSimpleDesignerMode) {
          Widgets = ReferenceTypeWidgetProxy(
            (layoutItem as RichLayoutItem).simpleDesignerData.DataModelInfo.Nature,
            (layoutItem as RichLayoutItem).simpleDesignerData.DataModelInfo.Type,
            ReferenceTypeWidget
          )[WidgetType];
          if (Widgets) {
            Widgets = Object.fromEntries(Object.entries(Widgets).filter(([key, value]) => value !== "CascadeDropdown"));
          }
        } else {
          const viewModelSoftwareModel = softwareModels.find(
            (model) =>
              model.DataModelGuid.toLowerCase() ===
              (
                viewModel as RelationViewModel
              ).ReferenceDataModelGuid.toLowerCase()
          );

          if (viewModelSoftwareModel != undefined) {
            const model: IWebSoftwareViewModel =
              window[
              "Model" +
              viewModelSoftwareModel.DataModelGuid.replace(
                /\-/gm,
                ""
              ).toLowerCase()
              ];

            Widgets = ReferenceTypeWidgetProxy((viewModel as RelationViewModel).Nature,
              (viewModel as RelationViewModel).Type, model.widgetMap[viewModelSoftwareModel.DataModelGuid.toLowerCase()])[WidgetType]
          } else {
            Widgets = ReferenceTypeWidgetProxy(
              (viewModel as RelationViewModel).Nature,
              (viewModel as RelationViewModel).Type,
              ReferenceTypeWidget
            )[WidgetType];
          }
          const { Nature, Type } = (viewModel as RelationViewModel);
          if (Widgets && Nature === RelationNature.Aggregation && Type === RelationType.OneToMany) {
            const filterWidgets = Object.entries(Widgets).filter(([key, value]) => value !== "CascadeDropdown")
            Widgets = Object.fromEntries(filterWidgets);
          }
        }
        return (
          !!Widgets && (<RadioGroup onChange={handleOnChange} value={value.Id}>
            {Object.keys(Widgets).map((widgetId) => {
              return (
                !!Widgets[widgetId] && (<Radio
                  key={Math.random()}
                  style={{ display: "block" }}
                  value={Number.parseInt(widgetId)}
                  disabled={Widgets[widgetId] === 'CascadeDropdown' && referenceDataModelType !== DataModelType.Permanent}
                >
                  {translate(Widgets[widgetId])}
                </Radio>))
            })}
          </RadioGroup>)
        );
      default:
        break;
    }
  };

  const WidgetListForm = ({ viewModel, layoutItemType, value, form, onChanged, WidgetType, dataType, layoutGuid }: {
    viewModel: RelationViewModel | ColumnViewModel;
    layoutItemType: LayoutItemType;
    value?: WidgetId;
    form?: WrappedFormUtils<any>;
    onChanged: () => void;
    WidgetType: WidgetType;
    dataType: number;
    layoutGuid: string;
  }) => {
    return (
      <div>
        <span
          style={{
            display: "block",
            fontSize: "11px",
            marginTop: "15px",
          }}
        >
          {translate(WidgetType)}:
        </span>
        {form.getFieldDecorator(WidgetType, {
          initialValue: (Design as LayoutItemColumnSetting)[WidgetType],
        })(
          <WidgetList
            viewModel={viewModel}
            layoutItemType={layoutItem.Type}
            onChanged={onChanged}
            WidgetType={WidgetType}
            dataType={dataType}
            layoutGuid={layoutGuid}

          />
        )}
      </div>
    )
  }

  const WidgetTypeOnChangeHandler = (value: SelectValue) => {
    form.setFieldsValue({ Widget: value.toString() });
    onChangeHandler();
  };

  const WidgetModeDisabled =
    layoutType == LayoutType.Define || layoutType === LayoutType.InlineArchive
      ? false
      : true;

  return (
    <>
      <FormRow>
        <Form.Item
          label={translate("DefaultWidgetType")}
          labelCol={{ span: 0 }}
          wrapperCol={{ span: 24 }}
        >
          {form.getFieldDecorator("Widget", {
            initialValue: Design.Widget || WidgetType.EditWidget,
          })(
            <Select
              disabled={WidgetModeDisabled}
              style={{ width: "100%" }}
              onChange={WidgetTypeOnChangeHandler}
            >
              <Option value={WidgetType.EditWidget}>
                {translate(WidgetType.EditWidget)}
              </Option>
              <Option value={WidgetType.DisplayWidget.toString()}>
                {translate(WidgetType.DisplayWidget.toString())}
              </Option>
              <Option value={WidgetType.DisabledWidget}>
                {translate(WidgetType.DisabledWidget)}
              </Option>
            </Select>
          )}
        </Form.Item>
      </FormRow>
      <FormRow>
        {
          <>
            {!WidgetModeDisabled && <WidgetListForm
              viewModel={viewModel}
              layoutItemType={layoutItem.Type}
              onChanged={onChangeHandler}
              form={form}
              WidgetType={WidgetType.EditWidget}
              dataType={isSimpleDesignerMode ? layoutItem.Type === LayoutItemType.Reference ? null : convertDesignerVersion2WidgetTypeToDataType((layoutItem as RichLayoutItem).simpleDesignerData.simpleDesignerWidgetType) : (viewModel as ColumnViewModel).DataType}
              layoutGuid={layoutGuid}
            />}

            <WidgetListForm
              viewModel={viewModel}
              layoutItemType={layoutItem.Type}
              onChanged={onChangeHandler}
              form={form}
              WidgetType={WidgetType.DisplayWidget}
              dataType={isSimpleDesignerMode ? layoutItem.Type === LayoutItemType.Reference ? null : convertDesignerVersion2WidgetTypeToDataType((layoutItem as RichLayoutItem).simpleDesignerData.simpleDesignerWidgetType) : (viewModel as ColumnViewModel).DataType}
              layoutGuid={layoutGuid}
            />
            {!isSimpleDesignerMode && <WidgetListForm
              viewModel={viewModel}
              layoutItemType={layoutItem.Type}
              onChanged={onChangeHandler}
              form={form}
              WidgetType={WidgetType.SearchWidget}
              dataType={isSimpleDesignerMode ? layoutItem.Type === LayoutItemType.Reference ? null : convertDesignerVersion2WidgetTypeToDataType((layoutItem as RichLayoutItem).simpleDesignerData.simpleDesignerWidgetType) : (viewModel as ColumnViewModel).DataType}
              layoutGuid={layoutGuid}
            />}
          </>
        }
      </FormRow>
      <br />
      {!isSimpleDesignerMode && <Button
        style={{ display: WidgetChanged ? "block" : "none" }}
        type={"primary"}
        onClick={onSave}
      >
        {translate("Save")}
      </Button>}
    </>
  );
};

interface SimpleValidationGeneratorProps {
  viewModel: ColumnViewModel | RelationViewModel;
  layoutItem: LayoutItemDesignerViewModel;
  form?: WrappedFormUtils<any>;
  layoutValidationRules: ValidationViewModel[];
  onSaveCallBackHandler: (props: {
    newValidationRules: ValidationViewModel[];
  }) => void;
  isSimpleDesignerMode: boolean;
}

const SimpleValidationGenerator = (props: SimpleValidationGeneratorProps) => {
  const {
    layoutItem,
    viewModel,
    form,
    layoutValidationRules,
    onSaveCallBackHandler,
    isSimpleDesignerMode
  } = props;

  const onSave = () => {
    const formData = form.getFieldsValue();

    const newValidationRules: ValidationViewModel[] = [
      ...layoutValidationRules.filter(
        (validation) =>
          validation.LayoutItemGuid.toLowerCase() !==
          layoutItem.Guid.toLowerCase()
      ),
    ];
    Object.keys(formData).forEach((key) => {
      if (formData[key] != false) {
        switch (key) {
          case ValidationType.Range.toString():
            const rangeValue: RangeValidationSetting<string> = formData[key];

            if (rangeValue.Max != null || rangeValue.Min != null) {
              const clearRangeValue = {};

              for (const key in rangeValue) {
                if (rangeValue[key] != null) {
                  const dataType = isSimpleDesignerMode ? convertDesignerVersion2WidgetTypeToDataType((layoutItem as RichLayoutItem).simpleDesignerData.simpleDesignerWidgetType) : (viewModel as ColumnViewModel).DataType;
                  switch (dataType.toString()) {
                    case "1":
                    case "3":
                    case "6":
                      clearRangeValue[key] = parseInt(rangeValue[key]);

                      break;
                    case "2":
                      clearRangeValue[key] = parseFloat(rangeValue[key]);

                      break;
                    case "5":
                      clearRangeValue[key] = String(rangeValue[key]).trim();

                      break;
                    default:
                      clearRangeValue[key] = rangeValue[key];
                      break;
                  }
                }
              }

              newValidationRules.push({
                Guid: utility.newGuid(),
                Type: parseInt(key) as ValidationType,
                LayoutItemGuid: layoutItem.Guid.toLowerCase(),
                Setting: JSON.stringify(clearRangeValue),
              });
            }

            break;
          default:
            newValidationRules.push({
              Guid: utility.newGuid(),
              Type: parseInt(key) as ValidationType,
              LayoutItemGuid: layoutItem.Guid.toLowerCase(),
              Setting: JSON.stringify(formData[key]),
            });
            break;
        }
      }
    });

    onSaveCallBackHandler({ newValidationRules });
  };

  if (layoutItem.Type === LayoutItemType.Column || layoutItem.Type === LayoutItemType.Reference) {
    return SimpleValidationColumnItemRenderer({
      viewModel: viewModel as ColumnViewModel,
      layoutItem,
      form,
      layoutValidationRules,
      onClickSave: onSave,
      isSimpleDesignerMode
    });
  }
};

interface DataModelInfoFormGeneratorProps {
  form?: WrappedFormUtils<any>;
  layoutItem: RichLayoutItem;
  componentName: string;
  onSaveCallbackHandler: (value: any) => void;
  dataModel: DataModelViewModel;
  layoutType: LayoutType;
  softwareModels: WebSoftwareComponentViewModel[];
  viewModel: RelationViewModel | ColumnViewModel;
}

const DataModelInfoFormGenerator = (props: DataModelInfoFormGeneratorProps) => {
  const {
    form,
    layoutItem,
    componentName,
    onSaveCallbackHandler,
    dataModel,
    layoutType,
    softwareModels,
    viewModel
  } = props;

  const getInitialDataModelInfo = () => {
    let result;
    if ((layoutItem as RichLayoutItem).simpleDesignerData.DataModelInfo) {
      result = { ...createEmptyDDMColumn(), ...(layoutItem as RichLayoutItem).simpleDesignerData.DataModelInfo, dataType: convertDesignerVersion2WidgetTypeToDataType((layoutItem as RichLayoutItem).simpleDesignerData.simpleDesignerWidgetType), editable: (layoutItem as RichLayoutItem).simpleDesignerData.status === 'added' }
    } else {
      result = { ...createEmptyDDMColumn(), dataType: convertDesignerVersion2WidgetTypeToDataType((layoutItem as RichLayoutItem).simpleDesignerData.simpleDesignerWidgetType) }
    }
    return result;
  }

  const handleColumnPropertyChange = (value) => {
    let result;
    if ((layoutItem as RichLayoutItem).simpleDesignerData.DataModelInfo) {
      result = { ...(layoutItem as RichLayoutItem).simpleDesignerData.DataModelInfo, ...value }
    } else {
      result = value;
    }
    onSaveCallbackHandler(result);
  }

  return (
    <SimpleDesignerColumnProperties
      hostSoftwareGuid=""
      onColumnPropertyChange={handleColumnPropertyChange}
      table={createEmptyDDMTable()}
      selectedItem={getInitialDataModelInfo()}
      useFormLayoutWrapper={false}
      inline={false}
    />
  );
};

const BasicInfoReferenceFormGenerator = (props: DataModelInfoFormGeneratorProps) => {
  const {
    layoutItem,
    onSaveCallbackHandler,
  } = props;

  const handleRelationInfoChange = (value) => {
    onSaveCallbackHandler(value);
  }

  return (
    <ReferenceProperties layoutItem={layoutItem} handleRelationInfoChange={handleRelationInfoChange} />
  );
};

interface ConnectionFieldGeneratorProps {
  viewModel: ColumnViewModel | RelationViewModel;
  layoutItem: LayoutItemReferenceDesignerViewModel;
  form?: WrappedFormUtils<any>;
  onSaveCallBackHandler: (props: AddDataModelVariableViewModel) => void;
  isSimpleDesignerMode: boolean;
  dataModel: DataModelViewModel;
  layoutType: LayoutType
  softwareModels
  dataModels: DataModelViewModel[]
}

const ConnectionFieldGenerator = (props: ConnectionFieldGeneratorProps) => {
  const {
    form,
    onSaveCallBackHandler,
    dataModel,
    dataModels,
    layoutItem
  } = props;

  const [selectItems, setSelectItem] = useState<SelectItem[]>([]);
  const getRelation = () => {
    let reternValue: RelationViewModel = null
    dataModels.forEach(i => {
      if (i.Relations.length > 0) {
        const findDM = i.Relations.find(d => d.ReferenceDataModelGuid === dataModel.Guid);
        if (findDM) {
          reternValue = findDM
        }
      }
    });
    return reternValue
  }

  const hasInputVariableTypeValue = () => !!dataModel?.InputVariableType

  useEffect(() => {
    let dataSource: SelectItem[] = [];
    if (hasInputVariableTypeValue() && dataModel.InputVariableType.Guids.length > 0) {
      dataModel.InputVariableType.Guids.map(guid => {
        dataModels.map(i => {
          if (i.Variables.length > 0) {
            const findDM = i.Variables.filter(d => d.ReferenceType === guid);
            if (findDM.length > 0) {
              findDM.forEach(f => dataSource.push({ value: f.Guid, key: f.Label }))
            }
          }
        });
      })
    }
    setSelectItem(dataSource);
  }, []);

  useEffect(() => {
    if (getRelation()?.VariableGuid && selectItems.length > 0) form.setFieldsValue({ Input: getRelation().VariableGuid })
    dataModels.forEach(i => {
      if (i.Variables && i.Variables.length > 0) {
        const variable = i.Variables.find(d => d.ReferenceGuid === layoutItem.RelationGuid);
        if (variable) {
          form.setFieldsValue({ Output: variable.Label })
        }
      }
    });
  }, [selectItems.length]);

  const onSave = () => {
    form.validateFields((errors, values) => {
      if (errors == null) {
        const data: AddDataModelVariableViewModel = {
          VariableGuid: values.Input,
          RelationGuid: getRelation().Guid,
        }

        onSaveCallBackHandler(data);
      }
    });
  }

  useEffect(() => {
    form.getFieldsValue(['Input']).Input && onSave();
  }, [form.getFieldsValue(['Input']).Input]);

  const getRules = () => {
    if (hasInputVariableTypeValue()) {
      if (dataModel.InputVariableType.IsRequired) return [{ required: true, message: translate("Required") }]
      else return
    }
  }

  return <>
    {selectItems.length > 0 && <Form.Item
      key={"Input"}
      label={translate("DataBinding_Input")}
      labelCol={{ span: 0, offset: 0 }}
      wrapperCol={{ span: 24, offset: 0 }}
    >
      {form.getFieldDecorator("Input", { rules: getRules() })
        (<SelectEx dataSource={selectItems} />)}
    </Form.Item>}
    <Form.Item
      key={"Output"}
      label={translate("DataBinding_Output")}
      labelCol={{ span: 0, offset: 0 }}
      wrapperCol={{ span: 24, offset: 0 }}
    >
      {form.getFieldDecorator("Output", {
        initialValue: '',
        rules: [
          { type: "string", required: false, message: translate("Required") },
        ],
      })(<Input disabled />)}
    </Form.Item>
  </>
}

const FormItemSettingForm = Form.create()(SettingFormGenerator);
const WidgetPropertiesForm = Form.create()(WidgetPropertiesGenerator);
const SimpleValidationForm = Form.create()(SimpleValidationGenerator);
const ConnectionFieldForm = Form.create()(ConnectionFieldGenerator);
const DataModelInfoForm = Form.create()(DataModelInfoFormGenerator);
const BasicInfoReferenceForm = Form.create()(BasicInfoReferenceFormGenerator)
export {
  FormItemSettingForm, WidgetPropertiesForm, SimpleValidationForm,
  DataModelInfoForm, BasicInfoReferenceForm, ConnectionFieldForm
};

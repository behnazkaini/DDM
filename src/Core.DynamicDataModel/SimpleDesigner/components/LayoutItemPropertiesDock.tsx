import * as React from "react";
import {
  Button,
  CustomIcon,
  Fieldset,
  FormLayout,
  Icon,
  Select,
  StackPanel,
  Tabs,
  Tooltip,
} from "didgah/ant-core-component";
import { PropertiesDockTabs, WidgetType } from "../../../typings/Core.DynamicDataModel/Enums";
import { useAppDispatch } from "../store/hook";
import { translate } from "../../../Utility/language";
import {
  BasicInfoReferenceForm,
  DataModelInfoForm,
  FormItemSettingForm,
  SimpleValidationForm,
  WidgetPropertiesForm,
} from "../../Designer/services/SettingFactory";
import {
  BaseLayoutItemSetting,
  IGetReferenceDefaultSettingResult,
  IWidgetFactory,
  LayoutItemColumnSetting,
  LayoutItemReferenceSetting,
  RichLayoutItem,
} from "../../../typings/Core.DynamicDataModel/Types";
import {
  AddLayoutSimpleValidation,
  SimpleDesignerGlobalPropsContext,
  SaveFieldSetting,
  SaveLayoutDataModelInfo,
  SaveRelationInfoToLayoutItem,
  SaveSimpleDesignerWidgetType,
  UpdateRelationInformation,
} from "../store/reducers/designLayoutSlice";
import { LayoutItemType } from "../../../Models/Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.LayoutItemType";
import { LayoutItemViewModel } from "../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.LayoutItemViewModel";
import { DataModelViewModel } from "../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.DataModelViewModel";
import { LayoutType } from "../../../Models/Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.LayoutType";
import { ValidationViewModel } from "../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.ValidationViewModel";
import { WebSoftwareComponentViewModel } from "../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.WebSoftwareComponentViewModel";
import { ColumnViewModel } from "../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.ColumnViewModel";
import { RelationViewModel } from "../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.RelationViewModel";
import SimpleDesignerWidgetTypeSelector from "./SimpleDesignerWidgetTypeSelector";
import FormPropertiesDock from "./FormPropertiesDock";
import { findDefaultWidgetTypeForDataType, findWidgetIdBySimpleDesignerWidgetType } from "../../TS/Widgets";
import useEffectSkipFirstTime from "../hooks/useEffectSkipFirstTime";
import { Spin } from "didgah/ant-core-component";
const LayoutContent = FormLayout.LayoutContent;

export interface RightSideContainerProps {
  widgetFactory: IWidgetFactory;
  toggleDockCallBack: () => void;
  activeTab: PropertiesDockTabs;
  layoutItemFocus: string;
  type: LayoutType;
  validationRules: ValidationViewModel[];
  softwareModels: WebSoftwareComponentViewModel[];
  onChangeCallback?: () => void;
  isFormFocused: boolean;
}

export const LayoutItemPropertiesDock = (props: RightSideContainerProps) => {
  const globalProps = React.useContext(SimpleDesignerGlobalPropsContext);
  const [widgetSettingChanged, setWidgetSettingChanged] = React.useState(false);
  const {
    toggleDockCallBack,
    activeTab,
    layoutItemFocus,
    widgetFactory,
    type,
    validationRules,
    softwareModels,
    onChangeCallback
  } = props;

  const dispatch = useAppDispatch();
  const layoutItem = widgetFactory.getLayoutItem(layoutItemFocus);
  const componentName = (layoutItem as RichLayoutItem).Type === LayoutItemType.NoneBindable || (layoutItem as RichLayoutItem).simpleDesignerData ? widgetFactory.getComponentName(layoutItem) : null;
  const dataModel: DataModelViewModel =
    widgetFactory.getDataModelColumns(layoutItem);
  const simpleValidationVisible =
    layoutItem.Type !== LayoutItemType.NoneBindable &&
    type !== LayoutType.Archive &&
    type !== LayoutType.DefineArchive;

  function getDataModel<T>(layoutItem: LayoutItemViewModel) {
    return widgetFactory.getDetailOfDataModel(layoutItem);
  }

  const onSaveWidgetSetting = (values: BaseLayoutItemSetting) => {
    dispatch(
      SaveFieldSetting({
        LayoutGuid: globalProps.layoutGuid,
        LayoutItemGuid: layoutItemFocus,
        Design: values,
        simpleDesignerData: (layoutItem as RichLayoutItem).simpleDesignerData
      })
    );
    !!onChangeCallback && onChangeCallback();
  };

  const onSaveDataModelInfo = (values: any) => {
    const {DataModelInfo, simpleDesignerWidgetType} = (layoutItem as RichLayoutItem).simpleDesignerData;
    const _simpleDesignerWidgetType = values.dataType !== DataModelInfo.dataType ? findDefaultWidgetTypeForDataType(values.dataType, 'EditWidget') : simpleDesignerWidgetType;
    const defaultSetting = widgetFactory.getInitialDefaultSetting({
      attribute: values as ColumnViewModel,
      type: LayoutItemType.Column,
      settingType: LayoutType.Define,
      widgetTypes: [WidgetType.EditWidget, WidgetType.DisplayWidget, WidgetType.SearchWidget],
      simpleDesignerWidgetType: _simpleDesignerWidgetType
    }) as BaseLayoutItemSetting

    dispatch(
      SaveLayoutDataModelInfo({
        LayoutGuid: globalProps.layoutGuid,
        LayoutItemGuid: layoutItemFocus,
        columnProperties: values,
        Design: defaultSetting,
        simpleDesignerWidgetType: _simpleDesignerWidgetType
      })
    );

    !!onChangeCallback && onChangeCallback();
  };

  const onSaveWidgetProperties = (props: {
    values: BaseLayoutItemSetting;
    isWidgetChanged: boolean;
  }) => {
    const { values, isWidgetChanged } = props;
    if (isWidgetChanged) {
      const defaultSetting: BaseLayoutItemSetting =
        widgetFactory.getDefaultSettingByWidgetId({
          widgetId: (values as LayoutItemColumnSetting)[
            (values as LayoutItemColumnSetting).Widget
          ].Id,
          widgetType: (values as LayoutItemColumnSetting).Widget,
          attribute: (layoutItem as RichLayoutItem).simpleDesignerData.DataModelInfo,
          layoutItemType: layoutItem.Type,
          settingLayoutType: LayoutType.Define,
          simpleDesignerWidgetType: (layoutItem as RichLayoutItem).simpleDesignerData.simpleDesignerWidgetType
        }) as BaseLayoutItemSetting;

      const defaultSimpleValidation = widgetFactory.getDefaultValidationByWidgetId({
        layoutItem: layoutItem,
        viewModel: null,
        widgetId: (values as LayoutItemColumnSetting)[
          WidgetType.DisplayWidget
        ].Id.toString(),
        widgetType: WidgetType.DisplayWidget,
        simpleDesignerWidgetType: (layoutItem as RichLayoutItem).simpleDesignerData.simpleDesignerWidgetType
      });
      dispatch(
        SaveFieldSetting({
          LayoutGuid: globalProps.layoutGuid,
          LayoutItemGuid: layoutItemFocus,
          Design: { ...values, ...defaultSetting },
          DefaultSimpleValidation: defaultSimpleValidation,
          simpleDesignerData: (layoutItem as RichLayoutItem).simpleDesignerData
        })
      );
    } else {
      dispatch(
        SaveFieldSetting({
          LayoutGuid: globalProps.layoutGuid,
          LayoutItemGuid: layoutItemFocus,
          Design: values,
          simpleDesignerData: (layoutItem as RichLayoutItem).simpleDesignerData
        })
      );
    }
    !!onChangeCallback && onChangeCallback();
  };

  const onSaveValidationRuleProperties = (props: {
    newValidationRules: ValidationViewModel[];
  }) => {
    const { newValidationRules } = props;
    dispatch(
      AddLayoutSimpleValidation({
        LayoutGuid: globalProps.layoutGuid,
        DesignerValidationGroup: newValidationRules,
      })
    );
    !!onChangeCallback && onChangeCallback();
  };

  const onChangedSettingHandler = (changed: boolean) => {
    setWidgetSettingChanged(changed);
  };

  const onCloseSidebar = () => {
    toggleDockCallBack();
    !!onChangeCallback && onChangeCallback();
  }
  layoutItem.Type === LayoutItemType.Reference

  const onSaveRelationInfo = (values: any) => {
    dispatch(
      SaveRelationInfoToLayoutItem({
        LayoutGuid: globalProps.layoutGuid,
        LayoutItemGuid: layoutItemFocus,
        ReferenceDataModelGuid: values.referenceDataModelGuid,
        RelationNature: values.relationNature,
        RelationType: values.relationType,
        ScopeGuid: values.scopeGuid,
        ReferenceDataModelType: values.referenceDataModelType
      })
    );

    const itemSetting: IGetReferenceDefaultSettingResult =
      widgetFactory.getInitialDefaultSetting({
        attribute: {
          Nature: Number(values.relationNature),
          Type: Number(values.relationType),
          ReferenceDataModelGuid: values.referenceDataModelGuid
        } as RelationViewModel,
        type: LayoutItemType.Reference,
        settingType: LayoutType.Define,
        widgetTypes: [WidgetType.EditWidget, WidgetType.DisplayWidget, WidgetType.SearchWidget],
        isSimpleDesignerMode: true
      }) as IGetReferenceDefaultSettingResult;
    const _Design: LayoutItemReferenceSetting = {
      ...JSON.parse(layoutItem.Design)
    }
    _Design.Widget = (itemSetting.Design as LayoutItemReferenceSetting).Widget;
    _Design.EditWidget = (itemSetting.Design as LayoutItemReferenceSetting).EditWidget;
    _Design.DisplayWidget = (itemSetting.Design as LayoutItemReferenceSetting).DisplayWidget;


    dispatch(UpdateRelationInformation({
      LayoutGuid: globalProps.layoutGuid,
      layoutItemGuid: layoutItem.Guid,
      data: {
        Design: JSON.stringify(_Design),
        ColumnGuids: itemSetting.ColumnGuids as any,
      }
    }))
    !!onChangeCallback && onChangeCallback();
  };

  const handleWidgetTypeChange = (value) => {
    const widgetTypes = [WidgetType.EditWidget, WidgetType.DisplayWidget];
    dispatch(SaveSimpleDesignerWidgetType({
      LayoutGuid: globalProps.layoutGuid,
      LayoutItemGuid: layoutItem.Guid,
      simpleDesignerWidgetType: value,
      Design: JSON.stringify(
        widgetFactory.getInitialDefaultSetting({
          attribute: null,
          type: LayoutItemType.Column,
          settingType: props.type,
          widgetTypes,
          simpleDesignerWidgetType: value
        }) as BaseLayoutItemSetting
      ),
    }))
  }

  return (
    <FormLayout style={{ backgroundColor: 'transparent' }}>
      <LayoutContent style={{ backgroundColor: 'transparent' }}>
        <div
          style={{
            backgroundColor: '#3578ac',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            margin: '0px -5px',
            marginTop: '-5px',
            padding: '5px',
            minHeight: '40px',
            height: '40px',
          }}
          className="propertiesdock_header"
        >
          <div
            style={{
              fontSize: 'var(--font-size-md)'
            }}
            className="propertiesdock_button-wrapper"
          >
            تنظیمات
          </div>
          <div className="propertiesdock_button-wrapper" style={{ marginRight: 'auto' }}>
            <CustomIcon style={{
              fontSize: '20px'
            }} type="angle-left" onClick={onCloseSidebar} />
          </div>
        </div>
          <>
            <p
              style={{
                fontSize: 'var(--font-size-md)',
                padding: '10px 0px'
              }}
            >اطلاعات مدل داده‌ای</p>
            {layoutItem.Type === LayoutItemType.Column && <DataModelInfoForm
              layoutItem={layoutItem as RichLayoutItem}
              componentName={componentName}
              onSaveCallbackHandler={onSaveDataModelInfo}
              dataModel={dataModel}
              layoutType={type}
              softwareModels={softwareModels}
              viewModel={(layoutItem as RichLayoutItem).simpleDesignerData.DataModelInfo}

            ></DataModelInfoForm>}

            {layoutItem.Type === LayoutItemType.Reference && <BasicInfoReferenceForm
              layoutItem={layoutItem as RichLayoutItem}
              componentName={componentName}
              onSaveCallbackHandler={onSaveRelationInfo}
              dataModel={dataModel}
              layoutType={type}
              softwareModels={softwareModels}
              viewModel={null}
            />}
            <p
              style={{
                fontSize: 'var(--font-size-md)',
                borderTop: '1px solid var(--input-border-color)',
                padding: '10px 0px'

              }}
            >تنظیمات</p>
            <FormItemSettingForm
              layoutItem={layoutItem}
              componentName={componentName}
              onSaveCallbackHandler={onSaveWidgetSetting}
              dataModel={dataModel}
              layoutType={type}
              softwareModels={softwareModels}
              viewModel={layoutItem.Type === LayoutItemType.NoneBindable ? null : (layoutItem as RichLayoutItem).simpleDesignerData.DataModelInfo}
              isSimpleDesignerMode
            ></FormItemSettingForm>

            {layoutItem.Type !== LayoutItemType.NoneBindable && (layoutItem as RichLayoutItem).simpleDesignerData && (
              <WidgetPropertiesForm
                layoutItem={layoutItem}
                componentName={componentName}
                onSaveCallbackHandler={onSaveWidgetProperties}
                viewModel={(layoutItem as RichLayoutItem).simpleDesignerData.DataModelInfo}
                layoutType={type}
                softwareModels={softwareModels}
                onChangedSetting={onChangedSettingHandler}
                isSimpleDesignerMode
                layoutGuid={globalProps.layoutGuid}
              ></WidgetPropertiesForm>)}

            {layoutItem.Type !== LayoutItemType.NoneBindable && simpleValidationVisible && (layoutItem as RichLayoutItem).simpleDesignerData && (
              <>
                <p
                  style={{
                    fontSize: 'var(--font-size-md)',
                    borderTop: '1px solid var(--input-border-color)',
                    padding: '10px 0px'

                  }}
                >اعتبارسنجی</p>
                <SimpleValidationForm
                  viewModel={(layoutItem as RichLayoutItem).simpleDesignerData.DataModelInfo}
                  layoutItem={layoutItem}
                  layoutValidationRules={validationRules}
                  onSaveCallBackHandler={onSaveValidationRuleProperties}
                  isSimpleDesignerMode
                />
              </>
            )}
          </>
      </LayoutContent>
    </FormLayout>
  );
};

export default LayoutItemPropertiesDock;

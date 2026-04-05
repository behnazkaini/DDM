import * as React from "react";
import {
  Button,
  CustomIcon,
  Icon,
  StackPanel,
  Tabs,
  Tooltip,
} from "didgah/ant-core-component";
import { PropertiesDockTabs, WidgetType } from "../../../typings/Core.DynamicDataModel/Enums";
import { useAppDispatch } from "../store/hook";
import { translate } from "../../../Utility/language";
import {
  ConnectionFieldForm,
  FormItemSettingForm,
  SimpleValidationForm,
  WidgetPropertiesForm,
} from "../services/SettingFactory";
import {
  BaseLayoutItemSetting,
  IWidgetFactory,
  LayoutItemColumnSetting,
  LayoutItemReferenceDesignerViewModel,
} from "../../../typings/Core.DynamicDataModel/Types";
import {
  AddLayoutSimpleValidation,
  GlobalPropsContext,
  SaveFieldSetting,
  SetDataModelVariables,
  TogglePropertiesItemDockAction,
} from "../store/reducers/designLayoutSlice";
import { LayoutItemType } from "../../../Models/Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.LayoutItemType";
import { LayoutItemViewModel } from "../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.LayoutItemViewModel";
import { DataModelViewModel } from "../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.DataModelViewModel";
import { LayoutType } from "../../../Models/Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.LayoutType";
import { ValidationViewModel } from "../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.ValidationViewModel";
import { WebSoftwareComponentViewModel } from "../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.WebSoftwareComponentViewModel";
import { ColumnViewModel } from "../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.ColumnViewModel";
import { AddDataModelVariableViewModel } from "../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.DataModel.AddDataModelVariableViewModel";

const TabPane = Tabs.TabPane;

interface RightSideContainerProps {
  widgetFactory: IWidgetFactory;
  toggleDockCallBack: () => void;
  activeTab: PropertiesDockTabs;
  layoutItemFocus: string;
  type: LayoutType;
  validationRules: ValidationViewModel[];
  softwareModels: WebSoftwareComponentViewModel[];
  onChangeCallback?: () => void;
}

export const PropertiesDock = (props: RightSideContainerProps) => {
  const globalProps = React.useContext(GlobalPropsContext);
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
  const componentName = widgetFactory.getComponentName(layoutItem);
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
      })
    );
    !!onChangeCallback && onChangeCallback();
  };

  const onSaveWidgetProperties = (props: {
    values: BaseLayoutItemSetting;
    isWidgetChanged: boolean;
  }) => {
    const { values, isWidgetChanged } = props;
    const dataModelColumn = getDataModel(layoutItem);
    if (isWidgetChanged) {
      const widgetId = (values as LayoutItemColumnSetting).Widget === WidgetType.DisabledWidget ? (values as LayoutItemColumnSetting)[WidgetType.EditWidget].Id : (values as LayoutItemColumnSetting)[
        (values as LayoutItemColumnSetting).Widget
      ].Id;

      const defaultSetting = widgetFactory.getDefaultSettingByWidgetId({
        widgetId: widgetId,
        widgetType: (values as LayoutItemColumnSetting).Widget,
        attribute: dataModelColumn,
        layoutItemType: layoutItem.Type,
        settingLayoutType: LayoutType.Define,
      });
      const defaultSimpleValidation = widgetFactory.getDefaultValidationByWidgetId({
        layoutItem: layoutItem,
        viewModel: dataModelColumn as ColumnViewModel,
        widgetId: widgetId.toString(),
        widgetType: (values as LayoutItemColumnSetting).Widget,
      });
      dispatch(
        SaveFieldSetting({
          LayoutGuid: globalProps.layoutGuid,
          LayoutItemGuid: layoutItemFocus,
          Design: { ...(defaultSetting).Design, ...values },
          DefaultSimpleValidation: defaultSimpleValidation,
        })
      );
    } else {
      dispatch(
        SaveFieldSetting({
          LayoutGuid: globalProps.layoutGuid,
          LayoutItemGuid: layoutItemFocus,
          Design: values,
        })
      );
    }
    dispatch(
      TogglePropertiesItemDockAction({
        LayoutGuid: globalProps.layoutGuid,
        IsOpen: false,
        ActiveSettingTab: PropertiesDockTabs.Setting,
        LayoutItemFocus: null,
      })
    );
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

  const onSaveConnectionFieldForm = (props: AddDataModelVariableViewModel) => {
    dispatch(
      SetDataModelVariables({ ...props, LayoutGuid: globalProps.layoutGuid })
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

  return (
    !!layoutItemFocus && (
      <>
        <Button className="DDM_CloseSidebar" type="ghost" icon="arrow-left" size="large" onClick={onCloseSidebar} />
        <Tabs className="DDM_Tab" defaultActiveKey={activeTab} tabPosition="left" onTabClick={() => null} >
          <TabPane
            tab={
              <Tooltip title={translate("Settings")} placement={"right"}>
                <li className="didgah-icon">
                  <CustomIcon type={"options"} style={{ fontSize: "22px" }} />
                </li>
              </Tooltip>
            }
            key={PropertiesDockTabs.Setting}
            disabled={widgetSettingChanged}
            style={{ overflowY: "auto" }}
          >
            <StackPanel widthRatio={1} verticalMode={true}>
              <FormItemSettingForm
                layoutItem={layoutItem}
                componentName={componentName}
                onSaveCallbackHandler={onSaveWidgetSetting}
                dataModel={dataModel}
                layoutType={type}
                softwareModels={softwareModels}
                viewModel={getDataModel(layoutItem)}
                isSimpleDesignerMode={false}
              ></FormItemSettingForm>
            </StackPanel>
          </TabPane>
          {layoutItem.Type !== LayoutItemType.NoneBindable && (
            <TabPane
              tab={
                <Tooltip title={translate("Widgets")} placement={"right"}>
                  <li className="didgah-icon">
                    <Icon type={"eye-o"} style={{ fontSize: "22px" }} />
                  </li>
                </Tooltip>
              }
              key={PropertiesDockTabs.Widget}
              style={{ overflowY: "auto" }}
            >
              <StackPanel widthRatio={1} verticalMode={true} className="DDM_WidgetProperties" style={{ flexWrap: 'nowrap' }}>
                <WidgetPropertiesForm
                  layoutItem={layoutItem}
                  componentName={componentName}
                  onSaveCallbackHandler={onSaveWidgetProperties}
                  viewModel={getDataModel(layoutItem)}
                  layoutType={type}
                  softwareModels={softwareModels}
                  onChangedSetting={onChangedSettingHandler}
                  isSimpleDesignerMode={false}
                  layoutGuid={globalProps.layoutGuid}
                ></WidgetPropertiesForm>
              </StackPanel>
            </TabPane>
          )}
          {simpleValidationVisible && (
            <TabPane
              tab={
                <Tooltip title={translate("Validation")} placement={"right"}>
                  <li className="didgah-icon">
                    <Icon type={"safety"} style={{ fontSize: "22px" }} />
                  </li>
                </Tooltip>
              }
              key={PropertiesDockTabs.Validation}
              disabled={widgetSettingChanged}
              style={{ overflowY: "auto" }}
            >
              <StackPanel widthRatio={1} verticalMode={true}>
                <SimpleValidationForm
                  viewModel={getDataModel(layoutItem)}
                  layoutItem={layoutItem}
                  layoutValidationRules={validationRules}
                  onSaveCallBackHandler={onSaveValidationRuleProperties}
                  isSimpleDesignerMode={false}
                />
              </StackPanel>
            </TabPane>
          )}

          {layoutItem.Type === LayoutItemType.Reference && <TabPane
            tab={
              <Tooltip title={translate("DataBinding")} placement={"right"}>
                <li className="didgah-icon">
                  <Icon type={"link"} style={{ fontSize: "22px" }} />
                </li>
              </Tooltip>
            }
            key={PropertiesDockTabs.Connection}
            disabled={widgetSettingChanged}
            style={{ overflowY: "auto" }}
          >
            <StackPanel widthRatio={1} verticalMode={true}>
              <ConnectionFieldForm
                viewModel={getDataModel(layoutItem)}
                layoutItem={layoutItem as LayoutItemReferenceDesignerViewModel}
                dataModel={dataModel}
                layoutType={type}
                softwareModels={softwareModels}
                onSaveCallBackHandler={onSaveConnectionFieldForm}
                isSimpleDesignerMode={false}
                dataModels={widgetFactory.dataModels}
              />
            </StackPanel>
          </TabPane>}

        </Tabs>
      </>
    )
  );
};

export default PropertiesDock;

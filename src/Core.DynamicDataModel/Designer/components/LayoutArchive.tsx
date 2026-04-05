import * as React from "react";
import {
  AutoComplete,
  Button,
  CheckboxList,
  Col,
  DataSourceItemObject,
  DataSourceItemType,
  Dropdown,
  Form,
  FormLayout,
  Icon,
  Menu,
  Message,
  Modal,
  Radio,
  Row,
  Select,
  StackPanel,
  Tabs,
  Tooltip,
  useAjax,
} from "didgah/ant-core-component";
import { ajax, translate, utility } from "didgah/common";
import {
  ArchiveDesignerTabs,
  DesignerMode,
  ErrorDesignType,
  OptionType,
  PropertiesDockTabs,
  WidgetType,
} from "../../../typings/Core.DynamicDataModel/Enums";
import { useAppDispatch } from "../store/hook";
import {
  ToggleArchiveColumn,
  ChangeActiveTab,
  GlobalPropsContext,
  TogglePropertiesLayoutDockAction,
  ToggleArchiveRelation,
  SaveLayoutArchiveSetting,
  PushLayoutModelAction,
  RemoveDefineArchiveForm,
  SelectSubLayoutArchiveDefineAction,
  TogglePropertiesItemDockAction,
} from "../store/reducers/designLayoutSlice";
import useFloorStack from "../hooks/useFloorStack";
import { CheckboxItem, CheckboxListStore } from "didgah/ant-core-component/providers";
import useArchiveColumns from "../hooks/useArchiveColumns";
import ActionBarFrame from "./designerPane/ActionBarFrame";
import { WidgetFactory } from "../../Widget/WidgetFactory";
import { LayoutItemType } from "../../../Models/Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.LayoutItemType";
import { ColumnViewModel } from "../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.ColumnViewModel";
import {
  ArchiveLayoutDesignerViewModel,
  ArchiveLayoutSetting,
  BaseLayoutItemSetting,
  DefineArchiveLayoutDesignerViewModel,
  IGetReferenceDefaultSettingResult,
  InlineArchiveLayoutDesignerViewModel,
  LayoutDesignerPermission,
  LayoutsModel,
  LayoutViewModelWithState,
  SelectSubLayoutArchiveDefineActionPayload,
} from "../../../typings/Core.DynamicDataModel/Types";
import { RelationViewModel } from "../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.RelationViewModel";
import ArchiveTable from "./designerPane/ArchiveTable";
import ArchiveLayoutPropertiesDock from "./ArchiveLayoutPropertiesDock";
import PropertiesDock from "./PropertiesDock";
import { RelationNature } from "../../../Models/Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.RelationNature";
import { LayoutType } from "../../../Models/Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.LayoutType";
import LayoutManager from "../../LayoutManager";
import {
  IInitialLocalState,
  SubLayoutActionType,
  SubLayoutRelationReducer,
} from "../store/localLayoutContext";
import InnerFormDesigner from "./InnerFormDesigner";
import {
  getArchiveDefineChildsLayout,
  isExistLayoutitemInCondition,
  isExistLayoutitemInEvent,
} from "../services/widgetManager";
import { StateManager } from "../services/StateManager";
import DDM_API from "../services/APIs";
import LayoutMapper from "../services/mapper/LayoutMapper";
import ConditionView from "./conditionPane/ConditionView";
import { InlineArchiveLayoutViewModel } from "../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.InlineArchiveLayoutViewModel";
import { LayoutItemColumnViewModel } from "../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.LayoutItemColumnViewModel";
import { LayoutItemReferenceViewModel } from "../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.LayoutItemReferenceViewModel";
import OperationOnEvent from "./operationOnEvent";
import { copyDesignerForm } from "../helper";

const LayoutSide = FormLayout.LayoutSide;
const LayoutContent = FormLayout.LayoutContent;
const TabPane = Tabs.TabPane;
const ActionBar = FormLayout.ActionBar;
const FormRow = Form.Row;
const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;
const ToolBar = FormLayout.ToolBar;

enum DesignerPaneType {
  Designer = "Designer",
  Validation = "Validation",
  OperationOnEvents = "OperationOnEvents",
}

const LayoutArchive = (props: { layoutType: LayoutType }) => {
  const rerenderCallback = React.useRef(() => null);
  const initialLocalState: IInitialLocalState = {
    SubLayoutGuid: utility.newGuid(),
    IsSubLayoutConfigeModalVisible: false,
    IsUserAllowedToSelectedSublayoutMode: true,
    IsSubLayoutLoading: true,
    SubLayoutConfige: { SubLayoutType: null, SubLayoutLayout: null },
    RelationViewModel: null,
    SubLayoutsModel: null,
    Mode: null,
  };

  const [layoutDefineBriefViewModel, setLayoutDefineBriefViewModel] =
    React.useState<Array<DataSourceItemType>>([]);
  const storeChecboxkList = React.useRef(new CheckboxListStore()).current;
  const [subLayoutState, subLayoutDispatch] = React.useReducer(
    SubLayoutRelationReducer,
    initialLocalState
  );
  const [sideBarIsOpen, setSideBarIsOpen] = React.useState(true);
  const [designPaneMode, setDesignPaneMode] = React.useState(
    DesignerPaneType.Designer
  );
  const dispatch = useAppDispatch();
  const {
    layoutGuid,
    mode,
    layoutType,
    closeWindow,
    dataViewModel,
    onSaveForm,
    openFormSettingModal,
    permission,
    context,
    plugins
  } = React.useContext(GlobalPropsContext);
  const [checkBoxItems, setCheckBoxItems] = React.useState<Array<CheckboxItem>>(
    useArchiveColumns()
  );
  const { currentLayout, currentFloor } = useFloorStack({
    layoutGuid: layoutGuid,
  });
  const layoutMapper = new LayoutMapper();
  const API = new DDM_API({ ajax: useAjax() });
  const { ActiveTab, PropertiesDockItemState, IsLoading, SoftwareModels } =
    currentFloor;

  const widgetFactory = new WidgetFactory({
    layoutModel: currentFloor.LayoutModels,
    layoutGuid: currentFloor.LayoutGuid,
    dataModelGuid: currentFloor.DataModelGuid,
    softwareModels: currentFloor.SoftwareModels,
    context,
  });

  const [dockActiveTab, setDockActiveTab] = React.useState<PropertiesDockTabs>(
    PropertiesDockItemState.ActiveSettingTab
  );

  const {
    SubLayoutGuid,
    IsSubLayoutConfigeModalVisible,
    IsUserAllowedToSelectedSublayoutMode,
    IsSubLayoutLoading,
    SubLayoutConfige,
    RelationViewModel,
    Mode,
    SubLayoutsModel,
  } = subLayoutState;

  const onSettingOptionHandler = () => {
    dispatch(
      TogglePropertiesLayoutDockAction({
        LayoutGuid: layoutGuid,
        IsOpen: !PropertiesDockItemState.IsOpen,
        ActiveSettingTab: PropertiesDockTabs.Setting,
        LayoutFocus: layoutGuid,
        IsFormFocused: true
      })
    );
  };

  const actionFramOptions =
    ActiveTab === ArchiveDesignerTabs.Columns
      ? [
        {
          Type: OptionType.Setting,
          onHandler: onSettingOptionHandler,
        },
      ]
      : [];

  const onChangeHandler = (tabName: ArchiveDesignerTabs) => {
    dispatch(
      ChangeActiveTab({ LayoutGuid: currentLayout.Guid, ActiveTab: tabName })
    );
  };

  const layoutItemExistsInValidationConfirmModal = () => {
    Modal.info({
      title: translate("DDMFieldExistInLayout"),
      content: translate("DDMFieldExistInLayoutDesc"),
      okText: translate("Ok"),
      cancelText: translate("Cancel"),
      onOk: () => {
        return;
      },
      onCancel: () => {
        return;
      },
    });
  };

  const checkBoxItemHandler = (value: CheckboxItem) => {
    const widgetTypes =
      layoutType === LayoutType.InlineArchive
        ? [WidgetType.EditWidget, WidgetType.DisplayWidget]
        : [WidgetType.DisplayWidget];
    const dataModel = currentFloor.LayoutModels.DataModels.find(
      (dataModel) =>
        dataModel.Guid.toLowerCase() ===
        currentFloor.DataModelGuid.toLowerCase()
    );
    const ColumnView = dataModel.Columns.find(
      (column) => column.Guid.toLowerCase() === value.value.toLowerCase()
    );
    const RelationView = dataModel.Relations.find(
      (relation) => relation.Guid.toLowerCase() === value.value.toLowerCase()
    );

    if (ColumnView != null && RelationView == null) {
      const layoutItems = currentLayout.Items.filter(
        (item) => item.Type === LayoutItemType.Column
      ).find(
        (layoutItem: LayoutItemColumnViewModel) =>
          layoutItem.ColumnGuid.toLowerCase() === ColumnView.Guid.toLowerCase()
      );

      if (
        layoutType !== LayoutType.Archive &&
        layoutType !== LayoutType.DefineArchive
      ) {
        const fieldsExistInValidation = !!layoutItems
          ? isExistLayoutitemInCondition(
            layoutItems.Guid,
            (currentLayout as InlineArchiveLayoutDesignerViewModel)
              .ComplexValidations
          )
          : false;
        const fieldExistsInEvent = !!layoutItems
          ? isExistLayoutitemInEvent(layoutItems.Guid, currentLayout.Design)
          : false;

        if (fieldsExistInValidation || fieldExistsInEvent) {
          storeChecboxkList.checkboxChange(value.value, true);
          layoutItemExistsInValidationConfirmModal();
          return;
        }
      }

      dispatch(
        ToggleArchiveColumn({
          LayoutGuid: layoutGuid,
          ColumnGuid: (ColumnView as ColumnViewModel).Guid,
          Design: JSON.stringify(
            widgetFactory.getInitialDefaultSetting({
              attribute: ColumnView as ColumnViewModel,
              type: LayoutItemType.Column,
              settingType: layoutType,
              widgetTypes,
            }) as BaseLayoutItemSetting
          ),
          Selected: value.selected,
          ItemType: LayoutItemType.Column,
          simpleDesignerWidgetType: null,
          selectedItems: checkBoxItems.filter(i => i.selected).length
        })
      );

    } else if (RelationView != null && ColumnView == null) {
      const layoutItems = currentLayout.Items.filter(
        (item) => item.Type === LayoutItemType.Reference
      ).find(
        (layoutItem: LayoutItemReferenceViewModel) =>
          layoutItem.RelationGuid.toLowerCase() ===
          RelationView.Guid.toLowerCase()
      );

      const fieldsExistInValidation =
        !!layoutItems && layoutType === LayoutType.InlineArchive
          ? isExistLayoutitemInCondition(
            layoutItems.Guid,
            (currentLayout as InlineArchiveLayoutDesignerViewModel)
              .ComplexValidations
          )
          : false;

      if (fieldsExistInValidation) {
        storeChecboxkList.checkboxChange(value.value, true);
        layoutItemExistsInValidationConfirmModal();
        return;
      }

      switch ((RelationView as RelationViewModel).Nature) {
        case RelationNature.Aggregation:
          const itemSetting: IGetReferenceDefaultSettingResult =
            widgetFactory.getInitialDefaultSetting({
              attribute: RelationView as RelationViewModel,
              type: LayoutItemType.Reference,
              settingType: LayoutType.Archive,
              widgetTypes,
            }) as IGetReferenceDefaultSettingResult;

          dispatch(
            ToggleArchiveRelation({
              LayoutGuid: layoutGuid,
              ReferenceGuid: (RelationView as RelationViewModel).Guid,
              ItemType: LayoutItemType.Reference,
              Design: JSON.stringify(itemSetting.Design),
              ColumnGuids: itemSetting.ColumnGuids,
              Selected: value.selected,
              selectedItems: checkBoxItems.filter(i => i.selected).length
            })
          );
          break;
        default:
          break;
      }
    }

    rerenderCallback.current();
  };

  const onSaveLayoutSettingHandle = (setting) => {
    rerenderCallback.current();
    dispatch(
      SaveLayoutArchiveSetting({
        LayoutGuid: layoutGuid,
        Widget: setting,
      })
    );
  };

  const handleArchiveFooterSettingSubManuClick = (e) => {
    Message.info(translate("DDMDefineRemoved"));
    if (e.key === "del") {
      dispatch(RemoveDefineArchiveForm({ LayoutGuid: layoutGuid }));
    }
  };

  const suMenuFooter = (
    <Menu onClick={handleArchiveFooterSettingSubManuClick}>
      <Menu.Item
        key="del"
        title={`${translate("Remove")} ${translate("Form")}`}
      >
        <Icon key={Math.random()} type="delete" style={{ fontSize: "12px" }} />
      </Menu.Item>
    </Menu>
  );

  const openNewDefineLayoutDesigner = () => {
    const layoutManager = new LayoutManager();

    let newArchiveSubLayout: LayoutViewModelWithState;
    newArchiveSubLayout = layoutManager.getNewLayout({
      dataModelGuid: currentLayout.DataModelGuid,
      relationViewModel: dataViewModel as RelationViewModel,
      layoutType: LayoutType.Define,
      newLayoutGuid: SubLayoutGuid,
    });

    const stateManager = StateManager({
      parentLayoutGuid: layoutGuid,
      layoutGuid: SubLayoutGuid,
      mode: DesignerMode.add,
      layoutType: LayoutType.Define,
      layoutModels: {
        DataModels: [...currentFloor.LayoutModels.DataModels],
        Layouts: [newArchiveSubLayout],
      },
      dataModelGuid: currentFloor.DataModelGuid,
      softwareModels: currentFloor.SoftwareModels,
    });

    dispatch(PushLayoutModelAction(stateManager.getNewFloor()));

    subLayoutDispatch({
      type: SubLayoutActionType.SET_SUBLAYOUT_LOADING,
      payload: { IsSubLayoutLoading: false },
    });

    subLayoutDispatch({
      type: SubLayoutActionType.SET_DEFINEVIEWMODEL,
      payload: {
        DefineViewModel: currentFloor.LayoutModels.DataModels.find(
          (dataModel) =>
            dataModel.Guid.toLowerCase() ===
            currentFloor.DataModelGuid.toLowerCase()
        ),
        SubLayoutConfige: {
          SubLayoutType: LayoutType.Define,
          SubLayoutLayout: "New",
        },
        IsUserAllowedToSelectedSublayoutMode: false,
        Mode: DesignerMode.add,
      },
    });
  };

  const DefineArchiveFooterSetting = (props: {
    openInnerSetting: (defineLayoutGuid: string) => void;
  }) => {
    const { openInnerSetting } = props;
    if (currentLayout.Type !== LayoutType.DefineArchive) {
      return null;
    }

    const openDefineDesigner = () => {
      openInnerSetting(
        (currentLayout as DefineArchiveLayoutDesignerViewModel).DefineLayoutGuid
      );
    };

    if (
      (currentLayout as DefineArchiveLayoutDesignerViewModel)
        .DefineLayoutGuid == null
    ) {
      return (
        <StackPanel justify={"flex-start"} align={"center"}>
          <FormRow>
            <FormItem
              labelCol={{ span: 8, offset: 0 }}
              wrapperCol={{ span: 14, offset: 0 }}
              label={translate("ArchiveDefineInsertForm")}
            >
              <div style={{ display: "flex" }}>
                <AutoComplete
                  dataSource={layoutDefineBriefViewModel}
                  style={{ width: 300 }}
                  onChange={onChangeFooterArchiveAutoComplete}
                  defaultValue={[translate("SelectAnForm")]}
                />
                <Tooltip
                  title={` ${translate("Form")} ${translate("New")} `}
                  placement="bottom"
                >
                  <Button icon="plus" onClick={openNewDefineLayoutDesigner} />
                </Tooltip>
              </div>
            </FormItem>
          </FormRow>
        </StackPanel>
      );
    } else {
      const DefineLayoutLabel = currentFloor.LayoutModels.Layouts.find(
        (layout) =>
          layout.Guid.toLowerCase() ===
          (
            currentLayout as DefineArchiveLayoutDesignerViewModel
          ).DefineLayoutGuid.toLowerCase()
      ).Label;

      return (
        <StackPanel justify={"flex-start"} align={"center"}>
          <FormRow>
            <FormItem
              labelCol={{ span: 8, offset: 0 }}
              wrapperCol={{ span: 14, offset: 0 }}
              label={translate("ArchiveDefineInsertForm")}
            >
              <div style={{ display: "flex" }}>
                {!permission.readOnly && (
                  <Dropdown.Button
                    onClick={openDefineDesigner}
                    overlay={suMenuFooter}
                  >
                    <Icon
                      key={Math.random()}
                      type="form"
                      style={{ fontSize: "12px" }}
                    />
                    {DefineLayoutLabel}
                  </Dropdown.Button>
                )}
                {permission.readOnly && (
                  <Button
                    onClick={openDefineDesigner}
                    style={{ minWidth: "auto !important" }}
                  >
                    {DefineLayoutLabel}
                  </Button>
                )}
              </div>
            </FormItem>
          </FormRow>
        </StackPanel>
      );
    }
  };

  const onOpenInnerDefineLayoutDesigner = (defineLayoutGuid: string) => {
    const definLayout = {
      ...(currentFloor.LayoutModels.Layouts.find(
        (layout) => layout.Guid.toLowerCase() === defineLayoutGuid.toLowerCase()
      ) as DefineArchiveLayoutDesignerViewModel),
    };

    const subLayoutChilds = getArchiveDefineChildsLayout({
      subLayout: definLayout,
      layoutGuid: definLayout.Guid,
      layouts: currentFloor.LayoutModels.Layouts,
    });

    if (definLayout.State === "Unchanged") {
      definLayout.State = "Unchanged";
    }

    subLayoutDispatch({
      type: SubLayoutActionType.SET_SUBLAYOUTSMODEL,
      payload: {
        SubLayoutsModel: {
          Layouts: [...subLayoutChilds, definLayout],
          DataModels: [...currentFloor.LayoutModels.DataModels],
        } as LayoutsModel,
        SubLayoutConfige: {
          SubLayoutLayout: defineLayoutGuid,
          SubLayoutType: LayoutType.Define,
        },
        SubLayoutGuid: defineLayoutGuid,
      },
    });
  };

  const FormSettingValidationError = () => {
    const tempLi = [];

    currentFloor.FormValidation.forEach((error) => {
      switch (error.ErrorType) {
        case ErrorDesignType.LayoutHasNotName:
          tempLi.push(translate("FormNameIsRequired"));
          break;

        default:
          break;
      }
    });

    return (
      <ul>
        {tempLi.map((li) => (
          <li className="DDM-ActionBar-Error-Message">{li}</li>
        ))}
      </ul>
    );
  };

  React.useEffect(() => {
    API.GetDataModelLayouts({
      DataModelGuid: currentLayout.DataModelGuid,
      LayoutType: LayoutType.Define,
    }).then((result) => {
      setLayoutDefineBriefViewModel(
        result.map((layout) => {
          return {
            label: layout.Label,
            value: layout.Guid,
          } as DataSourceItemObject;
        })
      );
    });
  }, []);

  const onChangeFooterArchiveAutoComplete = (value) => {
    API.GetLayoutByGuid({ Guid: value }).then((result) => {
      const ActionPayLoad: SelectSubLayoutArchiveDefineActionPayload<DefineArchiveLayoutDesignerViewModel> =
      {
        LayoutGuid: currentLayout.Guid,
        subLayoutGuid: value,
        layouts: layoutMapper.toDesignerViewModels(
          result.Layouts
        ) as DefineArchiveLayoutDesignerViewModel[],
        layoutType: LayoutType.DefineArchive,
      };
      dispatch(SelectSubLayoutArchiveDefineAction(ActionPayLoad));
    });
  };

  const onChangedesignPaneMode = (e) => {
    setDesignPaneMode(e.target.value);
    if (e.target.value === DesignerPaneType.Validation) {
      setSideBarIsOpen(false);
    } else {
      setSideBarIsOpen(true);
    }
  };

  const onArchiveSettingChangedHandler = (props: {
    reRender: () => void;
  }) => {
    rerenderCallback.current = props.reRender
  };

  const hasFormError =
    currentFloor.FormValidation.findIndex(
      (error) => error.ErrorType === ErrorDesignType.LayoutHasNotName
    ) > -1
      ? true
      : false;

  const archiveError = currentFloor.FormValidation.filter(
    (error) =>
      error.ErrorType === ErrorDesignType.ArchiveColumnsEmpty ||
      error.ErrorType === ErrorDesignType.ArchiveColumnsDuplicate ||
      error.ErrorType === ErrorDesignType.ArchiveDefineEmpty
  );

  const displayValidationButton =
    currentLayout.Type !== LayoutType.Archive &&
    currentLayout.Type !== LayoutType.DefineArchive;

  const toggleDockHandler = () => {
    dispatch(
      TogglePropertiesItemDockAction({
        LayoutGuid: layoutGuid,
        IsOpen: !PropertiesDockItemState.IsOpen,
        ActiveSettingTab: PropertiesDockItemState.ActiveSettingTab,
        LayoutItemFocus: null,
      })
    );
  };

  return (
    <>
      <FormLayout key={`ArchiveFormLayout_${currentLayout.Guid}`}>
        {displayValidationButton && (
          <ToolBar>
            <div style={{ display: "flex" }}>
              <RadioGroup
                onChange={onChangedesignPaneMode}
                value={designPaneMode}
              >
                <RadioButton value={DesignerPaneType.Designer}>
                  {translate("Design")}
                </RadioButton>
                <RadioButton value={DesignerPaneType.Validation}>
                  {translate("Validation")}
                </RadioButton>
                {/* <RadioButton value={DesignerPaneType.OperationOnEvents}>
                  {translate("OperationOnEvents")}
                </RadioButton> */}
              </RadioGroup>
            </div>
          </ToolBar>
        )}
        <LayoutSide
          dockType="simple"
          size={250}
          allowResize={false}
          open={!permission.readOnly}
        >
          <Tabs
            tabPosition="left"
            defaultActiveKey={ArchiveDesignerTabs.Columns}
            column={true}
            wrap={true}
            onChange={onChangeHandler}
            className={"DDM-core-designerTabs"}
            onTabClick={() => null}
          >
            <TabPane
              tab={translate("Columns")}
              key={ArchiveDesignerTabs.Columns}
            >
              <Row>
                <Col style={{ padding: 5, marginBottom: 5 }}>
                  <>
                    <CheckboxList
                      fieldsetTitle="ArchiveColumns"
                      hasFieldset={false}
                      showSelectAll={false}
                      height="100%"
                      columnCount={1}
                      store={storeChecboxkList}
                      checkboxItems={checkBoxItems}
                      onChangeCheckboxItem={checkBoxItemHandler}
                      disabled={PropertiesDockItemState.IsOpen}
                    ></CheckboxList>
                  </>
                </Col>
              </Row>
            </TabPane>
          </Tabs>
        </LayoutSide>
        <LayoutContent key={`ArchiveLayoutContentPane_${currentLayout.Guid}`}>
          <FormLayout key={`ArchiveFormLayoutPane_${currentLayout.Guid}`}>
            <LayoutSide
              dockType="simple"
              open={PropertiesDockItemState.IsOpen}
              size={350}
              Type={"left"}
              className={"DDM_Properties_sidebar"}
              allowResize={false}
            >
              {!!PropertiesDockItemState.LayoutItemFocus && (
                <PropertiesDock
                  widgetFactory={widgetFactory}
                  toggleDockCallBack={toggleDockHandler}
                  activeTab={dockActiveTab}
                  layoutItemFocus={PropertiesDockItemState.LayoutItemFocus}
                  type={props.layoutType}
                  validationRules={
                    (currentLayout as InlineArchiveLayoutDesignerViewModel)
                      .Validations
                  }
                  softwareModels={SoftwareModels}
                  onChangeCallback={rerenderCallback.current}
                ></PropertiesDock>
              )}
            </LayoutSide>
            <LayoutContent key={`ArchiveLayoutInnerContentPane_${currentLayout.Guid}`}>
              {designPaneMode === DesignerPaneType.Designer && (
                <div style={{ height: "100%" }}>
                  <ActionBarFrame
                    key={`ActionBar_${currentLayout.Guid}`}
                    Options={actionFramOptions}
                    beActiveTab={[ArchiveDesignerTabs.Columns]}
                    currentTab={ActiveTab}
                    designError={archiveError}
                    signs={[]}
                  >
                    <ArchiveTable
                      key={`ArchiveTable_${currentLayout.Guid}`}
                      signalOnChange={onArchiveSettingChangedHandler}
                      widgetFactory={widgetFactory}
                    />
                  </ActionBarFrame>
                  {!!currentFloor.PropertiesDockLayoutState.IsOpen && <ArchiveLayoutPropertiesDock
                    archiveLayoutWidgetSetting={
                      (JSON.parse(currentLayout.Design) as ArchiveLayoutSetting)
                        .Widget
                    }
                    layoutItems={
                      (currentLayout as ArchiveLayoutDesignerViewModel).Items
                    }
                    onSaveFormSetting={onSaveLayoutSettingHandle}
                    plugins={plugins}
                  />}
                  <DefineArchiveFooterSetting
                    openInnerSetting={onOpenInnerDefineLayoutDesigner}
                  />
                  {subLayoutState.IsSubLayoutConfigeModalVisible && (
                    <InnerFormDesigner
                      key={`ArchiveInnerFormDesigner_${currentLayout.Guid}`}
                      subLayoutState={subLayoutState}
                      subLayoutDispatch={subLayoutDispatch}
                      permission={permission}
                      softwareModels={currentFloor.SoftwareModels}
                      plugins={plugins}
                      parentLayoutType={currentLayout.Type}
                    ></InnerFormDesigner>
                  )}
                </div>
              )}
              {designPaneMode === DesignerPaneType.Validation && (
                <ConditionView
                  ComplexValidations={
                    (currentLayout as InlineArchiveLayoutDesignerViewModel)
                      .ComplexValidations
                  }
                  layoutItems={
                    (currentLayout as InlineArchiveLayoutViewModel).Items
                  }
                  widgetFactory={widgetFactory}
                />
              )}
              {designPaneMode === DesignerPaneType.OperationOnEvents && (
                <OperationOnEvent />
              )}
            </LayoutContent>
          </FormLayout>
        </LayoutContent>
        <ActionBar>
          <StackPanel justify={"center"} align={"center"}>
            {hasFormError && <FormSettingValidationError />}
            {!permission.readOnly && (
              <Tooltip
                placement="top"
                title={`${translate("Settings")} ${translate("Form")}`}
              >
                <Button
                  type="ghost"
                  shape="circle"
                  icon="setting"
                  onClick={() => openFormSettingModal(true)}
                  style={
                    hasFormError
                      ? {
                        backgroundColor: "#ffecec",
                        color: "red",
                        borderColor: "red",
                      }
                      : undefined
                  }
                />
              </Tooltip>
            )}
            <Button
              onClick={() => closeWindow({ rapidClose: permission.readOnly })}
            >
              {translate("Cancel")}
            </Button>
            {!permission.readOnly && (
              <Button loading={IsLoading} type="primary" onClick={onSaveForm}>
                {translate("Save")}
              </Button>
            )}
          </StackPanel>
        </ActionBar>
      </FormLayout>
    </>
  );
};

export default LayoutArchive;

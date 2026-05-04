import * as React from "react";
import {
  AutoComplete,
  Button,
  CheckboxList,
  Col,
  DataSourceItemObject,
  DataSourceItemType,
  Dropdown,
  Fieldset,
  Form,
  FormLayout,
  Icon,
  Menu,
  Message,
  Modal,
  Popover,
  Radio,
  Row,
  Select,
  StackPanel,
  Tabs,
  Tooltip,
  useAjax,
} from "didgah/ant-core-component";
import { ajax, dragDrop, translate, utility } from "didgah/common";
import {
  ArchiveDesignerTabs,
  DesignerItemType,
  DesignerMode,
  EditWidget,
  ErrorDesignType,
  OptionType,
  PropertiesDockTabs,
  WidgetType,
} from "../../../typings/Core.DynamicDataModel/Enums";
import { useAppDispatch } from "../store/hook";
import {
  ToggleArchiveColumn,
  ChangeActiveTab,
  SimpleDesignerGlobalPropsContext,
  ToggleArchiveRelation,
  SaveLayoutArchiveInfo,
  PushLayoutModelAction,
  RemoveDefineArchiveForm,
  SelectSubLayoutArchiveDefineAction,
  AddArchiveColumn,
  RemoveArchiveColumn,
  openPropertiesDockAction,
  openPropertiesItemDockAction,
  closePropertiesDockAction,
  closePropertiesItemDockAction,
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
  SimpleDesignerLayoutViewModelWithState,
  SelectSubLayoutArchiveDefineActionPayload,
  DefineArchiveLayoutSimpleDesignerViewModel,
  DragableMetadata,
  FieldMetadata,
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
  isDropAllowed,
  isExistLayoutitemInCondition,
  isExistLayoutitemInEvent,
} from "../services/widgetManager";
import { StateManager } from "../services/StateManager";
import DDM_API from "../services/APIs";
import LayoutMapper from "../services/mapper/LayoutMapper";
import ConditionView from "../../Designer/components/conditionPane/ConditionView";
import { InlineArchiveLayoutViewModel } from "../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.InlineArchiveLayoutViewModel";
import { LayoutItemColumnViewModel } from "../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.LayoutItemColumnViewModel";
import { LayoutItemReferenceViewModel } from "../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.LayoutItemReferenceViewModel";
import { copyDesignerForm } from "../helper";
import RelationList from "./designTab/RelationList";
import FieldList from "./designTab/fieldList";
import NotDragableFieldList from "./designTab/notDragableFieldList";
import FormPropertiesDock from "./FormPropertiesDock";
import LayoutItemPropertiesDock from "./LayoutItemPropertiesDock";
const DropArea = dragDrop.makeDropAreaComponent("mamad2", "div");

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
    SubLayoutConfige: { SubLayoutType: LayoutType.InlineArchive, SubLayoutLayout: null },
    RelationViewModel: null,
    SubLayoutsModel: null,
    Mode: null,
  };
  const [tableLoading, setTableLoading] = React.useState(false);
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
    plugins,
    softwareGuid,
    scopeGuid
  } = React.useContext(SimpleDesignerGlobalPropsContext);
  const [checkBoxItems, setCheckBoxItems] = React.useState<Array<CheckboxItem>>(
    []
  );
  const { currentLayout, currentFloor } = useFloorStack({
    layoutGuid: layoutGuid,
  });
  const widgetFactory = new WidgetFactory({
    layoutModel: currentFloor.LayoutModels,
    layoutGuid: currentFloor.LayoutGuid,
    dataModelGuid: currentFloor.DataModelGuid,
    softwareModels: currentFloor.SoftwareModels,
    context,
    isSimpleDesignerMode: true
  });
  const layoutMapper = new LayoutMapper({
     dataModelGuid: currentLayout.DataModelGuid,
      dataModels: widgetFactory.dataModels,
      softwareGuid,
      scopeGuid
     });
  const API = new DDM_API({ ajax: useAjax() });
  const { ActiveTab, PropertiesDockLayoutState,  PropertiesDockItemState, IsLoading, SoftwareModels } =
    currentFloor;

  const [dockActiveTab, setDockActiveTab] = React.useState<PropertiesDockTabs>(
    PropertiesDockLayoutState.ActiveSettingTab
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

  const [isColumnDragging, setIsColumnDragging] = React.useState(false);

  const onSettingOptionHandler = () => {
    dispatch(
      openPropertiesDockAction({
        LayoutGuid: layoutGuid,
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

  const handleRemoveColumn = (columnGuid: string) => {
    dispatch(
      RemoveArchiveColumn({
        LayoutGuid: layoutGuid,
        ColumnGuid: columnGuid
      })
    );
    rerenderCallback.current();
  };

  const onSaveLayoutInfoHandler = (setting) => {
    rerenderCallback.current();
    dispatch(
      SaveLayoutArchiveInfo({
        LayoutGuid: layoutGuid,
        Widget: setting,
      })
    );
  };

  const toggleFormDockHandler = () => {
    rerenderCallback.current();
    dispatch(
      closePropertiesDockAction({
        LayoutGuid: layoutGuid,
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

    let newArchiveSubLayout: SimpleDesignerLayoutViewModelWithState;
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
      ) as DefineArchiveLayoutSimpleDesignerViewModel),
    };

    const subLayoutChilds = getArchiveDefineChildsLayout({
      subLayout: definLayout,
      layoutGuid: definLayout.Guid,
      layouts: currentFloor.LayoutModels.Layouts,
    });

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
        case ErrorDesignType.WrongFormInfo:
          tempLi.push(translate("WrongFormInfo"));
          break;
        case ErrorDesignType.WrongColumnInfo:
          tempLi.push(translate("WrongColumnInfo"));
          break;
        default:
          break;
      }
    });

    return (
      <div>
        {tempLi.map((li, i) => (
          <span key={i} className="DDM-ActionBar-Error-Message">
            {li}
          </span>
        ))}
      </div>
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
      const ActionPayLoad: SelectSubLayoutArchiveDefineActionPayload<DefineArchiveLayoutSimpleDesignerViewModel> =
      {
        LayoutGuid: currentLayout.Guid,
        subLayoutGuid: value,
        layouts: layoutMapper.toDesignerViewModels(
          result.Layouts
        ) as DefineArchiveLayoutSimpleDesignerViewModel[],
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

  const archiveError = currentFloor.FormValidation.filter(
    (error) =>
      error.ErrorType === ErrorDesignType.ArchiveColumnsEmpty ||
      error.ErrorType === ErrorDesignType.ArchiveColumnsDuplicate ||
      error.ErrorType === ErrorDesignType.ArchiveDefineEmpty
  );

  const toggleDockHandler = () => {
    dispatch(
      closePropertiesItemDockAction({
        LayoutGuid: layoutGuid,
      })
    );
  };

  const canDrop = (Item: DragElementProps) => {
    const { metadata } = Item;
    const Metadata: DragableMetadata = metadata;

    return (
      isDropAllowed(Metadata.PayLoadItem, DesignerItemType.Column)
    );
  };

  const onDrop = (FieldItem: FieldMetadata) => {
    setTableLoading(true);
    const { metadata } = FieldItem;
    // @ts-ignore
    // fix later - Its for Cascade
    const { attributes, DesignType, PayLoadItem, ItemType, simpleDesignerWidgetType, DataModelType } = metadata;
    const widgetTypes = [WidgetType.EditWidget, WidgetType.DisplayWidget];
    dispatch(
      AddArchiveColumn({
        LayoutGuid: layoutGuid,
        ColumnGuid: '',
        Design: JSON.stringify(
          widgetFactory.getInitialDefaultSetting({
            attribute: null,
            type: LayoutItemType.Column,
            settingType: layoutType,
            widgetTypes,
            simpleDesignerWidgetType: simpleDesignerWidgetType
          }) as BaseLayoutItemSetting
        ),
        Selected: true,
        ItemType: LayoutItemType.Column,
        simpleDesignerWidgetType: simpleDesignerWidgetType
      })   
    ); 
    setTableLoading(false);
    rerenderCallback.current();
  }

  const handleColumnDragStart = () => {
    setIsColumnDragging(true);
  }

  const handleColumnDragEnd = () => {
    setIsColumnDragging(false);
  }


  return ( 
    <>
      <FormLayout key={`ArchiveFormLayout_${currentLayout.Guid}`}>
        <LayoutContent key={`ArchiveLayoutContentPane_${currentLayout.Guid}`}>
          <FormLayout key={`ArchiveFormLayoutPane_${currentLayout.Guid}`}>
            <LayoutSide
              dockType="simple"
              open={true}
              size={260}

              Type={"right"}
              className={"DDM_Properties_sidebar"}
              allowResize={false}
            >
              {!currentFloor.PropertiesDockItemState.FocusedLayoutItemGuid && !currentFloor.PropertiesDockLayoutState.IsFormFocused && (
              <Fieldset
                legend={translate("DDMFields")}
                className={"DDM-core-FieldTabPane"}
                style={{
                  height: 'auto',
                  minHeight: 'auto'
                }}              >
                <NotDragableFieldList
                  onDragStart={handleColumnDragStart}
                  onDragEnd={handleColumnDragEnd}
                />
              </Fieldset>)}
              {!!currentFloor.PropertiesDockItemState.FocusedLayoutItemGuid && (
                <LayoutItemPropertiesDock
                  key={currentFloor.PropertiesDockItemState.FocusedLayoutItemGuid}
                  widgetFactory={widgetFactory}
                  toggleDockCallBack={toggleDockHandler}
                  activeTab={dockActiveTab}
                  layoutItemFocus={currentFloor.PropertiesDockItemState.FocusedLayoutItemGuid}
                  type={props.layoutType}
                  validationRules={
                    (currentLayout as InlineArchiveLayoutDesignerViewModel)
                      .Validations
                  } 
                  softwareModels={SoftwareModels}
                  onChangeCallback={rerenderCallback.current}
                  isFormFocused={false}
                ></LayoutItemPropertiesDock>
              )}
              {currentFloor.PropertiesDockLayoutState.IsFormFocused && <FormPropertiesDock layoutGuid={layoutGuid} toggleDockCallBack={toggleDockHandler} />}
            </LayoutSide>
            <LayoutContent key={`ArchiveLayoutInnerContentPane_${currentLayout.Guid}`}>
              {designPaneMode === DesignerPaneType.Designer && (
                <div style={{ height: "100%" }}>
                  <DropArea
                    canDrop={canDrop}
                    onDrop={onDrop}
                  >
                        <ActionBarFrame
                          key={`ActionBar_${currentLayout.Guid}`}
                          Options={actionFramOptions}
                          beActiveTab={[ArchiveDesignerTabs.Columns]}
                          currentTab={ActiveTab}
                          designError={archiveError}
                          signs={[]}
                          style={isColumnDragging ? {backgroundColor: '#eef8e6'} : {}}
                        >
                          {!tableLoading &&

                            <ArchiveTable
                              key={`ArchiveTable_${currentLayout.Guid}`}
                              signalOnChange={onArchiveSettingChangedHandler}
                              widgetFactory={widgetFactory}
                              handleRemoveColumn={handleRemoveColumn}
                            />
                          }
                        </ActionBarFrame>
                  </DropArea>

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
            </LayoutContent>
          </FormLayout>
        </LayoutContent>
        <ActionBar>
          <StackPanel justify={"center"} align={"center"}>
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

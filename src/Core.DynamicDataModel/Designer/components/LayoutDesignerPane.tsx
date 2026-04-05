import { dragDrop, utility } from "didgah/common";
import * as React from "react";
import {
  getArchiveDefineChildsLayout,
  isDropAllowed,
} from "../services/widgetManager";
import { useAppDispatch } from "../store/hook";
import {
  AddGroupAction,
  GlobalPropsContext,
  LocalPropsContext,
  AddSelectedSubLayoutColumnAction,
  PushLayoutModelAction,
  TogglePropertiesItemDockAction,
  DragAndDropElement,
} from "../store/reducers/designLayoutSlice";
import {
  ArrangementType,
  DesignerItemType,
  DesignerMode,
  ErrorDesignType,
  NoneBindableTypeId,
} from "../../../typings/Core.DynamicDataModel/Enums";
import {
  AddSelectedSubLayoutColumnActionPayload,
  DefineArchiveLayoutDesignerViewModel,
  DefineLayoutDesignerViewModel,
  Design,
  DragableMetadata,
  FormValidationError,
  IWidgetFactory,
  LayoutItemNonBindableDesignerViewModel,
  LayoutItemNoneBindableSetting,
  LayoutsModel,
  RelationMetadata,
} from "../../../typings/Core.DynamicDataModel/Types";
import FieldsetMock from "./designerPane/Fieldset";
import useGroup from "../hooks/useGroup";
import { translate } from "didgah/common";
import { LayoutItemType } from "../../../Models/Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.LayoutItemType";
import useFloorStack from "../hooks/useFloorStack";
import { RelationViewModel } from "../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.RelationViewModel";
import { RelationType } from "../../../Models/Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.RelationType";
import InnerFormDesigner from "./InnerFormDesigner";
import { SubLayoutItemViewModel } from "../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.SubLayoutItemViewModel";
import { RelationNature } from "../../../Models/Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.RelationNature";
import {
  IInitialLocalState,
  SubLayoutActionType,
  SubLayoutRelationReducer,
} from "../store/localLayoutContext";
import { LayoutType } from "../../../Models/Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.LayoutType";
import {
  Form,
  FormLayout,
  Modal,
  Select,
  Tabs,
  useAjax,
} from "didgah/ant-core-component";
import { LayoutBriefViewModel } from "../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.LayoutBriefViewModel";
import DDM_API from "../services/APIs";
import LayoutManager from "./../../LayoutManager";
import { StateManager } from "../services/StateManager";
import LayoutMapper from "../services/mapper/LayoutMapper";
import PropertiesDock from "./PropertiesDock";

const DropArea = dragDrop.makeDropAreaComponent("group", "div");
const FormRow = Form.Row;
const FormItem = Form.Item;
const Option = Select.Option;
const LayoutSide = FormLayout.LayoutSide;
const LayoutContent = FormLayout.LayoutContent;

interface LayoutDesignerPaneProps {
  widgetFactory: IWidgetFactory;
}



export interface Action {
  type: SubLayoutActionType;
  payload: IInitialLocalState;
}

const LayoutDesignerPane = (props: LayoutDesignerPaneProps) => {
  const getInitialLocalState = (newGuid: string): IInitialLocalState => ({
    SubLayoutGuid: newGuid,
    IsSubLayoutConfigeModalVisible: false,
    IsUserAllowedToSelectedSublayoutMode: true,
    IsSubLayoutLoading: true,
    SubLayoutConfige: { SubLayoutType: null, SubLayoutLayout: null },
    RelationViewModel: null,
    SubLayoutsModel: null,
    Mode: null,
  });

  const initialLocalState = React.useRef(getInitialLocalState(utility.newGuid()))
  const API = new DDM_API({ ajax: useAjax() });
  const [subLayoutState, subLayoutDispatch] = React.useReducer(
    SubLayoutRelationReducer,
    initialLocalState.current
  );
  const layoutMapper = new LayoutMapper();
  const {
    SubLayoutGuid,
    IsSubLayoutConfigeModalVisible,
    IsUserAllowedToSelectedSublayoutMode,
    IsSubLayoutLoading,
    SubLayoutConfige,
    RelationViewModel,
    Mode,
    SubLayoutsModel,
    RowId,
    GroupGuid,
    ColId,
  } = subLayoutState;

  const [preConfigModalVisible, setpreConfigModalVisible] =
    React.useState(false);
  const [layoutBriefViewModel, setLayoutBriefViewModel] = React.useState<
    Array<LayoutBriefViewModel>
  >([]);
  const [preConfigLayoutTypeValue, setPreConfigLayoutTypeValue] =
    React.useState(false);
  const globalProps = React.useContext(GlobalPropsContext);
  const { currentLayout, currentFloor, } = useFloorStack({
    layoutGuid: globalProps.layoutGuid,
  });
  const { PropertiesDockItemState, SoftwareModels } = currentFloor;
  const dockActiveTab = PropertiesDockItemState.ActiveSettingTab;

  const { FormValidation } = currentFloor;
  const { widgetFactory } = props;
  const Groups = useGroup();
  const dispatch = useAppDispatch();

  const canDrop = (Item: DragElementProps) => {
    const { metadata } = Item;
    const Metadata: DragableMetadata = metadata;

    return isDropAllowed(Metadata.PayLoadItem, DesignerItemType.Canvas);
  };

  const onDrop = (item: RelationMetadata) => {
    const { metadata } = item;
    const { attributes, DesignType, PayLoadItem, ItemType } = metadata;

    switch (ItemType) {
      case LayoutItemType.NoneBindable:
        const NewGroupItem: LayoutItemNonBindableDesignerViewModel = {
          Guid: utility.newGuid(),
          ParentGuid: null,
          Type: LayoutItemType.NoneBindable,
          Design: JSON.stringify({
            Label: translate("NewFieldSet"),
            Widget: {
              Id: NoneBindableTypeId.Fieldset,
            },
          } as LayoutItemNoneBindableSetting),
          OrderIndex: Groups.Fieldset.length + 1,
        };

        dispatch(
          AddGroupAction({
            LayoutGuid: globalProps.layoutGuid,
            NewGroupItem: NewGroupItem,
            ParentLayoutItemGuid: null,
          })
        );
        break;
      case LayoutItemType.Reference:
        switch ((attributes as RelationViewModel).Nature) {
          case RelationNature.Composition:
            switch ((attributes as RelationViewModel).Type) {
              case RelationType.OneToOne:
                break;

              default:
                break;
            }
            break;
        }
        break;
      default:
        break;
    }
  };

  const onOpenInnerLayoutDesigner = (layoutItemGuid: string) => {
    const layoutItem: SubLayoutItemViewModel = (
      currentLayout.Items as SubLayoutItemViewModel[]
    ).find((item) => item.Guid.toLowerCase() === layoutItemGuid.toLowerCase());
    const subLayoutTarget = {
      ...(currentFloor.LayoutModels.Layouts.find(
        (layout) =>
          layout.Guid.toLowerCase() === layoutItem.SubLayoutGuid.toLowerCase()
      ) as DefineArchiveLayoutDesignerViewModel),
    };
    const subLayoutChilds = getArchiveDefineChildsLayout({
      subLayout: subLayoutTarget,
      layoutGuid: layoutItem.SubLayoutGuid.toLowerCase(),
      layouts: currentFloor.LayoutModels.Layouts,
    });

    subLayoutDispatch({
      type: SubLayoutActionType.SET_SUBLAYOUTSMODEL,
      payload: {
        SubLayoutsModel: {
          Layouts: [...subLayoutChilds, subLayoutTarget],
          DataModels: [...currentFloor.LayoutModels.DataModels],
        } as LayoutsModel,
        SubLayoutConfige: {
          SubLayoutLayout: subLayoutTarget.Guid.toLowerCase(),
          SubLayoutType: subLayoutTarget.Type,
        },
        SubLayoutGuid: subLayoutTarget.Guid.toLowerCase(),
      },
    });
  };

  const openPreConfigeModal = (props: {
    rowId: number;
    groupGuid: string;
    colId: number;
  }) => {
    setpreConfigModalVisible(true);
    subLayoutDispatch({
      type: SubLayoutActionType.SET_DROPPEDROWID,
      payload: {
        RowId: props.rowId,
        GroupGuid: props.groupGuid,
        ColId: props.colId,
      },
    });
  };

  const subLayoutListHandleOnChange = (value) => {
    subLayoutDispatch({
      type: SubLayoutActionType.SET_SUBLAYOUT_CONFIGE,
      payload: {
        SubLayoutConfige: {
          SubLayoutType: SubLayoutConfige.SubLayoutType,
          SubLayoutLayout: value,
        },
      },
    });
  };

  const subLayoutTypeHandleOnChange = (value) => {
    API.GetDataModelLayouts({
      DataModelGuid: RelationViewModel.ReferenceDataModelGuid,
      LayoutType: value,
    }).then((result) => {
      setPreConfigLayoutTypeValue(true);
      setLayoutBriefViewModel(result);
      subLayoutDispatch({
        type: SubLayoutActionType.SET_SUBLAYOUT_CONFIGE,
        payload: {
          SubLayoutConfige: {
            SubLayoutType: value,
            SubLayoutLayout: SubLayoutConfige.SubLayoutLayout,
          },
        },
      });
    });
  };

  const setArchiveDesignerTypeHandler = () => {
    if (SubLayoutConfige.SubLayoutLayout != null) {
      if (SubLayoutConfige.SubLayoutLayout === "New") {
        const layoutManager = new LayoutManager();
        const newArchiveSubLayout = layoutManager.getNewLayout({
          dataModelGuid: RelationViewModel.ReferenceDataModelGuid,
          relationViewModel: RelationViewModel,
          layoutType: SubLayoutConfige.SubLayoutType,
          newLayoutGuid: SubLayoutGuid,
        });
        newArchiveSubLayout.State = 'Added';
        const stateManager = StateManager({
          parentLayoutGuid: globalProps.layoutGuid,
          layoutGuid: SubLayoutGuid,
          mode: DesignerMode.add,
          layoutType: SubLayoutConfige.SubLayoutType,
          layoutModels: {
            DataModels: currentFloor.LayoutModels.DataModels,
            Layouts: [newArchiveSubLayout],
          },
          dataModelGuid: RelationViewModel.ReferenceDataModelGuid,
          softwareModels: currentFloor.SoftwareModels,
        });
        dispatch(PushLayoutModelAction(stateManager.getNewFloor()));

        subLayoutDispatch({
          type: SubLayoutActionType.SET_MODAL_VISIBLE,
          payload: { IsSubLayoutConfigeModalVisible: true },
        });
        setPreConfigLayoutTypeValue(false);
        setLayoutBriefViewModel([]);
        setpreConfigModalVisible(false);
        subLayoutDispatch({
          type: SubLayoutActionType.SET_SUBLAYOUT_LOADING,
          payload: { IsSubLayoutLoading: false },
        });
      } else {
        API.GetLayoutByGuid({ Guid: SubLayoutConfige.SubLayoutLayout }).then(
          (result) => {
            //SubLayout Column
            const SelectedubLayoutColumnContainer: AddSelectedSubLayoutColumnActionPayload =
            {
              LayoutGuid: currentLayout.Guid,
              ItemType: LayoutItemType.SubLayout,
              Design: null,
              RelationGuid: RelationViewModel.Guid,
              SubLayoutGuid: SubLayoutConfige.SubLayoutLayout,
              RowId: RowId,
              LayoutType: SubLayoutConfige.SubLayoutType,
              Layouts: layoutMapper.toDesignerViewModels(result.Layouts),
              GroupGuid,
              ColId,
            };

            dispatch(
              AddSelectedSubLayoutColumnAction({
                ...SelectedubLayoutColumnContainer,
              } as AddSelectedSubLayoutColumnActionPayload)
            );

            setPreConfigLayoutTypeValue(false);
            setLayoutBriefViewModel([]);
            setpreConfigModalVisible(false);
            subLayoutDispatch({
              type: SubLayoutActionType.SET_WIPE_LAYOUT,
              payload: null,
            });
          }
        );
      }
    }
  };

  const toggleDockHandler = () => {
    dispatch(
      TogglePropertiesItemDockAction({
        LayoutGuid: globalProps.layoutGuid,
        IsOpen: !PropertiesDockItemState.IsOpen,
        ActiveSettingTab: PropertiesDockItemState.ActiveSettingTab,
        LayoutItemFocus: null,
      })
    );
  };

  const onFindElementFieldSet = (id: number) => {
    const design: Design = JSON.parse(currentLayout.Design);
    const { Arrangement } = design;
    const fieldsetItem = Arrangement.find((item) => item.Id === id);

    return {
      index: Arrangement.indexOf(fieldsetItem),
      fieldsetItem: fieldsetItem,
    };
  };

  const onElementMoveFieldset = (
    draggedId,
    overIndex,
    item: { originalIndex: number; id: number; metadata: { type: ArrangementType } }
  ) => {
    const { fieldsetItem, index } = onFindElementFieldSet(draggedId);

    if (overIndex > -1 && index !== overIndex && item.originalIndex === index && index > -1) {
      dispatch(
        DragAndDropElement({
          LayoutGuid: currentLayout.Guid,
          type: item.metadata.type,
          currentIndex: index,
          newIndex: overIndex,
          Id: draggedId,
        })
      );
    }

  };

  const DesignPaneErrors = FormValidation.find(
    (error) => error.ErrorType === ErrorDesignType.DesignPaneEmpty
  );

  const focusOverlayCSS = PropertiesDockItemState.IsOpen
    ? "DDM-container-focus-overlay"
    : null;

  const getLayoutTypeText = (layoutType: LayoutType) => {
    switch (layoutType) {
      case LayoutType.Define:
        return `LayoutType_Define`;
      case LayoutType.Archive:
        return `LayoutType_Archive`;
      case LayoutType.DefineArchive:
        return `LayoutType_DefineArchive`;
      case LayoutType.InlineArchive:
        return `LayoutType_InlineArchive`;
    }
  }

  const getSubLayoutTypeOptions = () => {
    const agrigationOneToMany = [LayoutType.Archive, LayoutType.DefineArchive, LayoutType.InlineArchive];
    const agrigationOneToOne = [LayoutType.Archive, LayoutType.DefineArchive, LayoutType.InlineArchive];
    const compositionOneToMany = [LayoutType.Archive, LayoutType.DefineArchive, LayoutType.InlineArchive];
    const compositionOneToOne = [LayoutType.Define];
    switch (subLayoutState.RelationViewModel.Nature) {
      case RelationNature.Composition:
        switch (subLayoutState.RelationViewModel.Type) {
          case RelationType.OneToMany:
            return compositionOneToMany;
          case RelationType.OneToOne:
            return compositionOneToOne;
        }
      case RelationNature.Aggregation:
        switch (subLayoutState.RelationViewModel.Type) {
          case RelationType.OneToMany:
            return agrigationOneToMany;
          case RelationType.OneToOne:
            return agrigationOneToOne;
        }
    }
  }

  return (
    <>
      <FormLayout key={`DefineFormLayoutPane_${currentLayout.Guid}`}>
        <LayoutSide
          dockType="simple"
          open={PropertiesDockItemState.IsOpen}
          size={350}
          Type={"left"}
          className={"DDM_Properties_sidebar"}
          allowResize={false}
          style={!PropertiesDockItemState.IsOpen ? { transition: "width 0.3s linear" } : undefined}
        >
          {!!PropertiesDockItemState.LayoutItemFocus && (
            <PropertiesDock
              widgetFactory={widgetFactory}
              toggleDockCallBack={toggleDockHandler}
              activeTab={dockActiveTab}
              layoutItemFocus={PropertiesDockItemState.LayoutItemFocus}
              type={LayoutType.Define}
              validationRules={
                (currentLayout as DefineLayoutDesignerViewModel).Validations
              }
              softwareModels={SoftwareModels}
            ></PropertiesDock>
          )}
        </LayoutSide>
        <LayoutContent
          className={focusOverlayCSS}
          style={{ position: "relative" }}
        >
          <LocalPropsContext.Provider
            value={{
              onOpenInnerLayoutDesigner,
              subLayoutState,
              subLayoutDispatch,
              openPreConfigeModal,
            }}
          >
            <DropArea
              canDrop={canDrop}
              onDrop={onDrop}
              style={{ height: "100%" }}
            >
              <span
                className={"DDM-hasError-DesignPane-Alert"}
                style={{ display: !!DesignPaneErrors ? "block" : "none" }}
              >
                {translate("DDMFormIsEmpty")}
              </span>
              {Groups.Fieldset.map((group) => {
                const designError: FormValidationError[] =
                  FormValidation.filter(
                    (error) => error.FormItemId === group.Item.Id
                  );
                return (
                  <FieldsetMock
                    id={group.Item.Id}
                    key={group.Item.Id}
                    widgetFactory={widgetFactory}
                    item={group}
                    designError={designError}
                    onFindElement={onFindElementFieldSet}
                    onElementMove={onElementMoveFieldset}
                  ></FieldsetMock>
                );
              })}
            </DropArea>
          </LocalPropsContext.Provider>
          {subLayoutState.IsSubLayoutConfigeModalVisible && (
            <InnerFormDesigner
              key={`InnerFormDesigner_${currentLayout.Guid}`}
              subLayoutState={subLayoutState}
              subLayoutDispatch={subLayoutDispatch}
              permission={globalProps.permission}
              softwareModels={currentFloor.SoftwareModels}
              parentLayoutType={currentLayout.Type}
              plugins={globalProps.plugins}
            ></InnerFormDesigner>
          )}
          <Modal
            title={translate("DDMPreConfigeModalTitle")}
            visible={preConfigModalVisible}
            onOk={setArchiveDesignerTypeHandler}
            onCancel={() => setpreConfigModalVisible(false)}
            width={"60%"}
            closable={true}
            maskClosable={false}
          > {preConfigModalVisible && (
            <>
              <FormRow>
                <FormItem
                  label={translate("DDMSubLayoutType")}
                  labelCol={{ span: 6, offset: 0 }}
                  wrapperCol={{ span: 18, offset: 0 }}
                >
                  <Select
                    disabled={!IsUserAllowedToSelectedSublayoutMode}
                    defaultValue={null}
                    value={SubLayoutConfige.SubLayoutType}
                    style={{ width: "85%" }}
                    onChange={subLayoutTypeHandleOnChange}
                    labelInValue={false}
                  >
                    {getSubLayoutTypeOptions().map(((item, index) =>
                    (<Option value={item}>
                      {translate(getLayoutTypeText(item))}
                    </Option>)
                    ))}
                  </Select>
                </FormItem>
              </FormRow>
              <FormRow>
                <FormItem
                  label={translate("DDMSubLayoutList")}
                  labelCol={{ span: 6, offset: 0 }}
                  wrapperCol={{ span: 18, offset: 0 }}
                >
                  <Select
                    disabled={!preConfigLayoutTypeValue}
                    defaultValue={null}
                    value={SubLayoutConfige.SubLayoutLayout}
                    style={{ width: "85%" }}
                    onChange={subLayoutListHandleOnChange}
                  >
                    <Option value={"New"}>{translate("New")}</Option>
                    {layoutBriefViewModel.map((layout) => (
                      <Option key={layout.Label} value={layout.Guid}>
                        {layout.Label}
                      </Option>
                    ))}
                  </Select>
                </FormItem>
              </FormRow></>)}
          </Modal>
        </LayoutContent>
      </FormLayout>
    </>
  );
};

export default LayoutDesignerPane;

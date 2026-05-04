import React from "react";
import { createAsyncThunk, createSlice, current, PayloadAction } from "@reduxjs/toolkit";
import {
  addFieldToColumn,
  addGroup,
  addRowToGroup,
  addSubLayoutToColumn,
  formArchiveDesignerValidator,
  formDefineDesignerValidator,
  getArchiveDefineChildsLayout,
  getDesignItemCount,
  getLayoutItemsOfRow,
  removeFieldFromColumn,
  removeGroup,
  removeRowFromGroup,
  updateLocationFieldset,
  updateLocationRow,
} from "../../services/widgetManager";
import { ArrangementType, DefineDesignerTabs, PropertiesDockTabs, DesignerMode, DesignerItemType, EditWidget } from "../../../../typings/Core.DynamicDataModel/Enums";
import {
  AddColumnActionPayload,
  AddGroupActionPayload,
  AddRelationActionPayload,
  AddRowActionPayload,
  Design,
  FormValidationError,
  SimpleDesignerLayoutViewModelWithState,
  LayoutItemReferenceSetting,
  LayoutsModel,
  RemoveActionPayload,
  RemoveFieldActionPayload,
  SaveFieldDesignActionPayload,
  SetDesignerTabsPayload,
  SetLoadingPayload,
  SimpleDesignerIStateStack,
  RemoveGroupActionPayload,
  AddSubLayoutColumnActionPayload,
  ToggleColumnArchiveLayout,
  ToggleRelationArchiveLayout,
  SaveArchiveLayoutSetting,
  PropertiesDockItemActionPayload,
  PropertiesDockLayoutActionPayload,
  DesignerPanSubLayoutPayload,
  UpdateArchiveLayoutActionPayload,
  AddSubLayoutArchiveDefineActionPayload,
  SelectSubLayoutArchiveDefineActionPayload,
  SimpleDesignerAddSelectedSubLayoutColumnActionPayload,
  DesignerComplexValidationViewModel,
  DefineLayoutSimpleDesignerViewModel,
  InlineArchiveLayoutSimpleDesignerViewModel,
  DefineArchiveLayoutSimpleDesignerViewModel,
  FormEvents,
  ArchiveLayoutSetting,
  ArchiveLayoutSimpleDesignerViewModel,
  LayoutDesignerPermission,
  ICLoseProps,
  IWidgetFactory,
  AddDrawingActionPayload,
  LayoutItemNonBindableDesignerViewModel,
  RichLayoutItem,
  InlineArchiveLayoutDesignerViewModel,
  ToggleColumnSimpleDesignerArchiveLayout,
  SimpleDesignerAddColumnActionPayload,
} from "../../../../typings/Core.DynamicDataModel/Types";
import { LayoutItemType } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.LayoutItemType";
import { translate, utility } from "didgah/common";
import { LayoutItemColumnViewModel } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.LayoutItemColumnViewModel";
import { LayoutItemReferenceViewModel } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.LayoutItemReferenceViewModel";
import { RelationType } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.RelationType";
import { LayoutType } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.LayoutType";
import { SubLayoutItemViewModel } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.SubLayoutItemViewModel";
import { RelationNature } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.RelationNature";
import { RelationViewModel } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.RelationViewModel";
import { ColumnViewModel } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.ColumnViewModel";
import { ValidationViewModel } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.ValidationViewModel";
import { LayoutItemViewModel } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.LayoutItemViewModel";
import { DataModelType } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.DataModelType";
import { DidgahContextProps } from "didgah/ant-core-component";
import { DDMPlugin } from "@didgah/ddm-plugins";
import { SaveLayoutPluginViewModel } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.SaveLayoutPluginViewModel";
import { LayoutPluginViewModel } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.LayoutPluginViewModel";
import { ColumnPropertiesForm } from "../../../../Core.DynamicDataModel/Modeler/Components/ColumnProperties";
import { string } from "prop-types";
import { convertDesignerVersion2WidgetTypeToDataType } from "../../../../Core.DynamicDataModel/Widget/WidgetFactory";
import { guid } from "didgah/common";
import { getLayoutItemState, getLayoutState, getNextAvailableColumnLabel, getNextAvailableColumnName } from "../../helper";
import { getDefaultDataTypeSetting } from "../../../../Core.DynamicDataModel/TS/Validations";
import { ColumnDataType } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.ColumnDataType";
import { resolveAggregationOneToManyColumnGuids, resolveAggregationOneToOneColumnGuids } from "../strategies/columnGuidStrategies";

export interface PushLayoutModelActionPayload {
  currentLayoutGuid?: string | null;
  layoutGuid: string;
  dataModelGuid: string;
  LayoutModels: LayoutsModel;
}

interface IGlobalPropsContext {
  layoutGuid: string;
  mode: DesignerMode;
  layoutType: LayoutType;
  closeWindow: (props: ICLoseProps) => void;
  dataViewModel?: RelationViewModel | ColumnViewModel;
  parentGuid: string; onSaveForm: () => void;
  openFormSettingModal: (state: boolean) => void;
  permission: LayoutDesignerPermission;
  context: DidgahContextProps;
  plugins: DDMPlugin[];
  copyFormAppFn?: Function;
  scopeGuid?: string;
  softwareGuid?: string;
}

interface ILocalComplexConditionContext {
  widgetFactory: IWidgetFactory;
  currentLayout: SimpleDesignerLayoutViewModelWithState;
}

export const LocalComplexConditionContext = React.createContext<ILocalComplexConditionContext>({ widgetFactory: null, currentLayout: null });
export const SimpleDesignerGlobalPropsContext = React.createContext<IGlobalPropsContext>({ layoutGuid: null, mode: null, layoutType: null, closeWindow: null, dataViewModel: null, parentGuid: null, onSaveForm: null, openFormSettingModal: null, permission: { readOnly: false }, context: null, copyFormAppFn: null, plugins: [], scopeGuid: null });
export const LocalPropsContext = React.createContext<DesignerPanSubLayoutPayload>(null);
const initialState: Array<SimpleDesignerIStateStack<SimpleDesignerLayoutViewModelWithState>> = [];

const IsFormValid: (layout: SimpleDesignerLayoutViewModelWithState) => Promise<Array<FormValidationError>> = async (layout: SimpleDesignerLayoutViewModelWithState) => {
  switch (layout.Type) {
    case LayoutType.Define:
      return formDefineDesignerValidator({ layout });
    case LayoutType.Archive:
    case LayoutType.DefineArchive:
    case LayoutType.InlineArchive:
      return formArchiveDesignerValidator({ layout });
    default:
      break;
  }
}

export const ValidateFormAsyncAction = createAsyncThunk(
  'layoutDesignStore/ValidateFormAsync',
  async (layout: SimpleDesignerLayoutViewModelWithState) => {
    const response = await IsFormValid(layout);
    return { Errors: response, LayoutGuid: layout.Guid }
  }
)

export const layoutDesignSlice = createSlice({
  name: "layoutDesignStore",
  initialState,
  reducers: {
    openPropertiesDockAction: (state: Array<SimpleDesignerIStateStack<SimpleDesignerLayoutViewModelWithState>>, action: PayloadAction<{ LayoutGuid: string }>) => {
      const stateIndex = state.findIndex((floor) => floor.LayoutGuid.toLowerCase() === action.payload.LayoutGuid.toLowerCase());
      state[stateIndex].PropertiesDockLayoutState.IsFormFocused = true;
      state[stateIndex].PropertiesDockItemState.FocusedLayoutItemGuid = null;
      
    },
    closePropertiesDockAction: (state: Array<SimpleDesignerIStateStack<SimpleDesignerLayoutViewModelWithState>>, action: PayloadAction<{ LayoutGuid: string }>) => {
      const stateIndex = state.findIndex((floor) => floor.LayoutGuid.toLowerCase() === action.payload.LayoutGuid.toLowerCase());
      state[stateIndex].PropertiesDockLayoutState.IsFormFocused = false;
    },
    openPropertiesItemDockAction: (state: Array<SimpleDesignerIStateStack<SimpleDesignerLayoutViewModelWithState>>, action: PayloadAction<{ LayoutGuid: string; layoutItemGuid: string; }>) => {
      const stateIndex = state.findIndex((floor) => floor.LayoutGuid.toLowerCase() === action.payload.LayoutGuid.toLowerCase());
      state[stateIndex].PropertiesDockItemState.FocusedLayoutItemGuid = action.payload.layoutItemGuid;
      state[stateIndex].PropertiesDockLayoutState.IsFormFocused = false;
    },
    closePropertiesItemDockAction: (state: Array<SimpleDesignerIStateStack<SimpleDesignerLayoutViewModelWithState>>, action: PayloadAction<{ LayoutGuid: string }>) => {
      const stateIndex = state.findIndex((floor) => floor.LayoutGuid.toLowerCase() === action.payload.LayoutGuid.toLowerCase());
      state[stateIndex].PropertiesDockItemState.FocusedLayoutItemGuid = null;
      state[stateIndex].PropertiesDockLayoutState.IsFormFocused = false;
    },
    ChangeLoadingState: (state: Array<SimpleDesignerIStateStack<SimpleDesignerLayoutViewModelWithState>>, action: PayloadAction<SetLoadingPayload>) => {
      const stateIndex = state.findIndex((floor) => floor.LayoutGuid.toLowerCase() === action.payload.LayoutGuid.toLowerCase())
      state[stateIndex].IsLoading = action.payload.IsLoading;
    },
    ChangeActiveTab: (state: Array<SimpleDesignerIStateStack<SimpleDesignerLayoutViewModelWithState>>, action: PayloadAction<SetDesignerTabsPayload>) => {
      const stateIndex = state.findIndex((floor) => floor.LayoutGuid.toLowerCase() === action.payload.LayoutGuid.toLowerCase());
      state[stateIndex].ActiveTab = action.payload.ActiveTab;
    },
    PushLayoutModelAction: (
      state,
      action: PayloadAction<SimpleDesignerIStateStack<SimpleDesignerLayoutViewModelWithState>>
    ) => {

      const currentLayout = action.payload.LayoutModels.Layouts.find((layout) => layout.Guid.toLowerCase() === action.payload.LayoutGuid.toLowerCase());

      const design: Design = JSON.parse(currentLayout.Design);
      const newFloor: SimpleDesignerIStateStack<SimpleDesignerLayoutViewModelWithState> = {
        ActiveTab: DefineDesignerTabs.Container,
        IsLoading: false,
        StateVersion: 0,
        FormValidation: [],
        PropertiesDockItemState: {
          IsOpen: false,
          LayoutItemFocus: null,
          ActiveSettingTab: PropertiesDockTabs.Setting,
          IsFormFocused: false
        },
        ...action.payload,
        Count: currentLayout.Type === LayoutType.Define ? getDesignItemCount(design) : { Column: 0, Group: 0, Field: 0, Row: 0 },
      };
      state.push(newFloor);
    },
    AddGroupAction: (state: Array<SimpleDesignerIStateStack<DefineLayoutSimpleDesignerViewModel>>, action: PayloadAction<AddGroupActionPayload>) => {
      const currentFloor = state.find((floor) => floor.LayoutGuid.toLowerCase() === action.payload.LayoutGuid.toLowerCase());
      const currentLayout = currentFloor.LayoutModels.Layouts.find((layout) => layout.Guid.toLowerCase() === action.payload.LayoutGuid.toLowerCase());

      if (!!currentLayout) {
        (
          currentLayout.Items as Array<LayoutItemViewModel>
        ).push(action.payload.NewGroupItem);

        const DesignObj = JSON.parse(
          currentLayout.Design
        ) as Design;

        currentLayout.Design = JSON.stringify(
          {...addGroup(
            DesignObj,
            action.payload.NewGroupItem.Guid,
            action.payload.ParentLayoutItemGuid
          ),DesignType:0}
        );

        currentFloor.FormValidation = formDefineDesignerValidator({
          layout: currentLayout,
        });

        currentLayout.SimpleDesignerLayoutState = getLayoutState(currentLayout.SimpleDesignerLayoutState, "Modified") ;
        currentFloor.Count.Group++;
        currentFloor.StateVersion += 0.1;
      }
    },
    RemoveGroupAction: (state: Array<SimpleDesignerIStateStack<SimpleDesignerLayoutViewModelWithState>>, action: PayloadAction<RemoveGroupActionPayload>) => {
      const currentFloor = state.find((floor) => floor.LayoutGuid.toLowerCase() === action.payload.LayoutGuid.toLowerCase());
      const currentLayout = currentFloor.LayoutModels.Layouts.find((layout) => layout.Guid.toLowerCase() === action.payload.LayoutGuid.toLowerCase()) as InlineArchiveLayoutSimpleDesignerViewModel;

      //Removing Rows from Arrangement
      const DesignObj = JSON.parse(currentLayout.Design) as Design;
      const newDesignObj = removeGroup(DesignObj, action.payload.GroupGuid);
      currentLayout.Design = JSON.stringify({...newDesignObj,DesignType:0});

      // Remove rules that exists in group 
      const ChildItemsGuid: string[] = currentLayout.Items.filter((item: LayoutItemViewModel | LayoutItemColumnViewModel) => {
        if (item.Type !== LayoutItemType.NoneBindable) {
          return item.ParentGuid.toLowerCase() === action.payload.GroupGuid.toLowerCase()
        }
        return false
      }
      ).map((layoutItem) => layoutItem.Guid.toLowerCase());

      const newValidation = currentLayout.Validations.filter((rule) => {
        return !ChildItemsGuid.includes(rule.LayoutItemGuid.toLowerCase())
      });
      currentLayout.Validations = newValidation;

      //Removing SubLayouts in Group
      const subLayoutItems = currentLayout.Items.filter((item) => item.Type === LayoutItemType.SubLayout && item.ParentGuid.toString() === action.payload.GroupGuid.toString());
      if (subLayoutItems.length > 0) {
        subLayoutItems.forEach((sublayout: SubLayoutItemViewModel) => {
          const subLayoutIndex = currentFloor.LayoutModels.Layouts.findIndex((layout) => layout.Guid.toLowerCase() === sublayout.SubLayoutGuid.toLowerCase());

          if (currentFloor.LayoutModels.Layouts[subLayoutIndex].Type === LayoutType.DefineArchive) {
            const subLayoutChilds = getArchiveDefineChildsLayout({ subLayout: currentFloor.LayoutModels.Layouts[subLayoutIndex] as DefineArchiveLayoutSimpleDesignerViewModel, layoutGuid: action.payload.LayoutGuid, layouts: currentFloor.LayoutModels.Layouts })
            const subLayoutChildsGuid = subLayoutChilds.map((layout) => layout.Guid.toLowerCase());
            subLayoutChildsGuid.forEach((guid) => {
              const childSubLayoutToRemoveIndex = currentFloor.LayoutModels.Layouts.findIndex((layout) => layout.Guid.toLowerCase() === guid.toLowerCase());
              currentFloor.LayoutModels.Layouts.splice(childSubLayoutToRemoveIndex, 1);
            });
          }

          const subLayoutToRemoveIndex = currentFloor.LayoutModels.Layouts.findIndex((layout) => layout.Guid.toLowerCase() === sublayout.SubLayoutGuid.toLowerCase());
          if (currentFloor.LayoutModels.Layouts[subLayoutToRemoveIndex].SimpleDesignerLayoutState === "Added") {
            currentFloor.LayoutModels.Layouts.splice(subLayoutToRemoveIndex, 1);
          }
        });
      }

      //Removing Items items in Group
      const tempItems = currentLayout.Items.filter(
        (item: LayoutItemViewModel | LayoutItemColumnViewModel) => {
          if (item.ParentGuid !== null) {
            return (
              item.ParentGuid.toLowerCase() !== action.payload.GroupGuid.toLowerCase()
            );
          }
          return item.Guid.toLowerCase() !== action.payload.GroupGuid.toLowerCase()
        }
      );
      currentLayout.Items = [...tempItems];


      //Validating form again
      currentFloor.FormValidation = formDefineDesignerValidator({
        layout: currentLayout,
      });
   
      currentLayout.SimpleDesignerLayoutState = getLayoutState(currentLayout.SimpleDesignerLayoutState, "Modified") ;
      currentFloor.Count = getDesignItemCount(newDesignObj);
      currentFloor.StateVersion += 0.1;
    },
    AddRowAction: (state: Array<SimpleDesignerIStateStack<DefineLayoutSimpleDesignerViewModel>>, action: PayloadAction<AddRowActionPayload>) => {
      const currentFloor = state.find((floor) => floor.LayoutGuid.toLowerCase() === action.payload.LayoutGuid.toLowerCase());
      const currentLayout = currentFloor.LayoutModels.Layouts.find((layout) => layout.Guid.toLowerCase() === action.payload.LayoutGuid.toLowerCase());

      const DesignObj = JSON.parse(currentLayout.Design) as Design;

      const newDesignObj = addRowToGroup({
        designObj: DesignObj,
        LayoutItemGuid: action.payload.LayoutItemGroupGuid,
        Cols: action.payload.Cols,
        RowId: action.payload.RowId,
      });

      currentLayout.Design = JSON.stringify({...newDesignObj,DesignType:0});
      currentFloor.FormValidation = formDefineDesignerValidator({
        layout: currentLayout,
      });

      currentLayout.SimpleDesignerLayoutState = getLayoutState(currentLayout.SimpleDesignerLayoutState, "Modified") ;
      currentFloor.Count = getDesignItemCount(newDesignObj);
      currentFloor.StateVersion += 0.1;
    },
    RemoveRowAction: (state: Array<SimpleDesignerIStateStack<SimpleDesignerLayoutViewModelWithState>>, action: PayloadAction<RemoveActionPayload>) => {
      const currentFloor = state.find((floor) => floor.LayoutGuid.toLowerCase() === action.payload.LayoutGuid.toLowerCase());
      const currentLayout = currentFloor.LayoutModels.Layouts.find((layout) => layout.Guid.toLowerCase() === action.payload.LayoutGuid.toLowerCase()) as InlineArchiveLayoutSimpleDesignerViewModel;

      const DesignObj = JSON.parse(currentLayout.Design) as Design;

      const layoutItemGuidsOfRow = getLayoutItemsOfRow({
        rowId: action.payload.RowId,
        designObj: DesignObj,
      });

      const subLayoutItems = currentLayout.Items.filter((item) => item.Type === LayoutItemType.SubLayout && layoutItemGuidsOfRow.includes(item.Guid.toString()));
      if (subLayoutItems.length > 0) {
        subLayoutItems.forEach((sublayout: SubLayoutItemViewModel) => {
          const subLayoutIndex = currentFloor.LayoutModels.Layouts.findIndex((layout) => layout.Guid.toLowerCase() === sublayout.SubLayoutGuid.toLowerCase());

          if (currentFloor.LayoutModels.Layouts[subLayoutIndex].Type === LayoutType.DefineArchive) {
            const subLayoutChilds = getArchiveDefineChildsLayout({ subLayout: currentFloor.LayoutModels.Layouts[subLayoutIndex] as DefineArchiveLayoutSimpleDesignerViewModel, layoutGuid: action.payload.LayoutGuid, layouts: currentFloor.LayoutModels.Layouts })
            const subLayoutChildsGuid = subLayoutChilds.map((layout) => layout.Guid.toLowerCase());
            subLayoutChildsGuid.forEach((guid) => {
              const childSubLayoutToRemoveIndex = currentFloor.LayoutModels.Layouts.findIndex((layout) => layout.Guid.toLowerCase() === guid.toLowerCase());
              currentFloor.LayoutModels.Layouts.splice(childSubLayoutToRemoveIndex, 1);
            });
          }

          const subLayoutToRemoveIndex = currentFloor.LayoutModels.Layouts.findIndex((layout) => layout.Guid.toLowerCase() === sublayout.SubLayoutGuid.toLowerCase());
          if (currentFloor.LayoutModels.Layouts[subLayoutToRemoveIndex].SimpleDesignerLayoutState === "Added") {
            currentFloor.LayoutModels.Layouts.splice(subLayoutToRemoveIndex, 1);
          }
        });
      }

      const newDesignObj = removeRowFromGroup(
        DesignObj,
        action.payload.LayoutItemGroupGuid,
        action.payload.RowId
      );

      currentLayout.Design = JSON.stringify({...newDesignObj,DesignType:0});
      currentLayout.Items = currentLayout.Items.filter(
        (item: LayoutItemViewModel) => {
          return (
            layoutItemGuidsOfRow.findIndex(
              (guid) => guid.toLowerCase() === item.Guid.toLowerCase()
            ) === -1
          );
        }
      );

      const newValidation = currentLayout.Validations.filter((rule) => {
        return !layoutItemGuidsOfRow.includes(rule.LayoutItemGuid.toLowerCase())
      });
      currentLayout.Validations = newValidation;

      currentFloor.FormValidation = formDefineDesignerValidator({
        layout: currentLayout,
      });
      currentLayout.SimpleDesignerLayoutState = getLayoutState(currentLayout.SimpleDesignerLayoutState, "Modified") ;
      currentFloor.Count = getDesignItemCount(newDesignObj);
      currentFloor.StateVersion += 0.1;
    },
    AddColumnAction: (state: Array<SimpleDesignerIStateStack<DefineLayoutSimpleDesignerViewModel>>, action: PayloadAction<SimpleDesignerAddColumnActionPayload>) => {
      const currentFloor = state.find((floor) => floor.LayoutGuid.toLowerCase() === action.payload.LayoutGuid.toLowerCase());
      const currentLayout = currentFloor.LayoutModels.Layouts.find((layout) => layout.Guid.toLowerCase() === action.payload.LayoutGuid.toLowerCase());
      const columnsNameBaseOnLayouts = (currentLayout.Items as unknown as RichLayoutItem[]).filter(item => item.Type === LayoutItemType.Column).map(item => item.simpleDesignerData.DataModelInfo.name);
      const columnsNameBaseOnDataModel = action.payload.dataModel ? action.payload.dataModel.Columns.map(c => c.Name) : [];
      const columnsLabelBaseOnLayout = (currentLayout.Items as unknown as RichLayoutItem[]).filter(item => item.Type === LayoutItemType.Column).map(item => item.simpleDesignerData.DataModelInfo.label);
      const columnsLabelBaseOnDataModel = action.payload.dataModel ? action.payload.dataModel.Columns.map(c => c.Label) : [];
      const columnName = getNextAvailableColumnName(columnsNameBaseOnLayouts.concat(columnsNameBaseOnDataModel));
      const columnLabel = getNextAvailableColumnLabel(columnsLabelBaseOnLayout.concat(columnsLabelBaseOnDataModel));
      const {
        RowId,
        ColumnlGuid,
        GroupGuid,
        ItemType,
        DesignType,
        Design,
        ColumnId,
        LayoutItemGuid,
        simpleDesignerWidgetType
      } = action.payload;

      const DesignObj = JSON.parse(currentLayout.Design) as Design;
      const columnGuid = guid.newGuid();
      currentLayout.Items.push({
        Guid: LayoutItemGuid,
        ParentGuid: GroupGuid,
        ColumnGuid: columnGuid,
        Design: Design,
        Type: LayoutItemType.Column,
        OrderIndex: currentFloor.Count.Field + 1, 
        simpleDesignerData: { 
          status: 'added',
          simpleDesignerWidgetType,
          DataModelInfo: {
            name: columnName,
            label: columnLabel,
            guid: columnGuid,
            dataType: convertDesignerVersion2WidgetTypeToDataType(simpleDesignerWidgetType)
          }
        }
      } as RichLayoutItem);
      //Add field to column in arrangement
      const newDesignObj = addFieldToColumn(DesignObj, RowId, ColumnId, DesignType, LayoutItemGuid);
      currentLayout.Design = JSON.stringify({...newDesignObj,DesignType:0});

      currentFloor.FormValidation = formDefineDesignerValidator({
        layout: currentLayout,
      });
      currentLayout.SimpleDesignerLayoutState = getLayoutState(currentLayout.SimpleDesignerLayoutState, "Modified") ;
      currentLayout.SimpleDesignerDataModelState = getLayoutState(currentLayout.SimpleDesignerDataModelState, "Modified") ;
      currentFloor.Count = getDesignItemCount(newDesignObj);
      currentFloor.StateVersion += 0.1;
      currentLayout.Validations = [...currentLayout.Validations, ...action.payload.validations];
    },
    RemoveColumnAction: (
      state: Array<SimpleDesignerIStateStack<SimpleDesignerLayoutViewModelWithState>>,
      action: PayloadAction<RemoveFieldActionPayload>
    ) => {
      const currentFloor = state.find((floor) => floor.LayoutGuid.toLowerCase() === action.payload.LayoutGuid.toLowerCase());
      const currentLayout = currentFloor.LayoutModels.Layouts.find((layout) => layout.Guid.toLowerCase() === action.payload.LayoutGuid.toLowerCase()) as DefineLayoutSimpleDesignerViewModel;

      const DesignLayoutObj = JSON.parse(currentLayout.Design) as Design;

      const layoutItem = currentLayout.Items.find((item) => item.Guid.toLowerCase() === action.payload.LayoutItemGuid.toLowerCase());

      currentLayout.Validations = currentLayout.Validations.filter((rule) => rule.LayoutItemGuid.toLowerCase() !== action.payload.LayoutItemGuid.toLowerCase());

      if (layoutItem.Type === LayoutItemType.SubLayout) {
        const subLayoutToRemoveIndex = currentFloor.LayoutModels.Layouts.findIndex((layout) => layout.Guid.toLowerCase() === (layoutItem as SubLayoutItemViewModel).SubLayoutGuid.toLowerCase());

        if (currentFloor.LayoutModels.Layouts[subLayoutToRemoveIndex].Type === LayoutType.DefineArchive) {
          const subLayoutChilds = getArchiveDefineChildsLayout({ subLayout: currentFloor.LayoutModels.Layouts[subLayoutToRemoveIndex] as DefineArchiveLayoutSimpleDesignerViewModel, layoutGuid: action.payload.LayoutGuid, layouts: currentFloor.LayoutModels.Layouts })
          const subLayoutChildsGuid = subLayoutChilds.map((layout) => layout.Guid.toLowerCase());
          subLayoutChildsGuid.forEach((guid) => {
            const childSubLayoutToRemoveIndex = currentFloor.LayoutModels.Layouts.findIndex((layout) => layout.Guid.toLowerCase() === guid.toLowerCase());
            currentFloor.LayoutModels.Layouts.splice(childSubLayoutToRemoveIndex, 1);
          });
        }

      }

      currentLayout.Items = currentLayout.Items.filter(
        (item) =>
          item.Guid.toLowerCase() !==
          action.payload.LayoutItemGuid.toLowerCase()
      );

      const newObjectDesign = removeFieldFromColumn(
        DesignLayoutObj,
        action.payload.LayoutItemGuid.toLowerCase()
      )

      currentLayout.Design = JSON.stringify({...newObjectDesign,DesignType:0});

      currentFloor.FormValidation = formDefineDesignerValidator({
        layout: currentLayout,
      });
      currentLayout.SimpleDesignerLayoutState = getLayoutState(currentLayout.SimpleDesignerLayoutState, "Modified") ;
      currentLayout.SimpleDesignerDataModelState = getLayoutState(currentLayout.SimpleDesignerDataModelState, "Modified") ;
      currentFloor.Count = getDesignItemCount(newObjectDesign);
      currentFloor.StateVersion += 0.1;
    },
    SaveFieldSetting: (
      state: Array<SimpleDesignerIStateStack<DefineLayoutSimpleDesignerViewModel>>,
      action: PayloadAction<SaveFieldDesignActionPayload>
    ) => {
      const { simpleDesignerData } = action.payload;
      const currentFloor = state.find((floor) => floor.LayoutGuid.toLowerCase() === action.payload.LayoutGuid.toLowerCase());
      const currentLayout = currentFloor.LayoutModels.Layouts.find((layout) => layout.Guid.toLowerCase() === action.payload.LayoutGuid.toLowerCase());
      currentLayout.Items.forEach((item) => {
        if (
          item.Guid.toLowerCase() ===
          action.payload.LayoutItemGuid.toLowerCase()
        ) {
          const oldDesign = JSON.parse(item.Design);
          const newDesign = { ...oldDesign, ...action.payload.Design };
          item.Design = JSON.stringify(newDesign);
          switch (item.Type) {
            case LayoutItemType.Reference:

              if (simpleDesignerData.relationCandidatesType === DesignerItemType.SoftwareModelAggregation) {
                (item as LayoutItemReferenceViewModel).ColumnGuids = [];
              } else {
                if (simpleDesignerData.DataModelInfo.Nature === RelationNature.Aggregation && simpleDesignerData.DataModelInfo.Type == RelationType.OneToOne) {
                  if((newDesign as LayoutItemReferenceSetting).CascadeDropDownLevel) {
                    break;
                  }
                  (item as LayoutItemReferenceViewModel).ColumnGuids = resolveAggregationOneToOneColumnGuids(newDesign as LayoutItemReferenceSetting);
                } else if (simpleDesignerData.DataModelInfo.Nature === RelationNature.Aggregation && simpleDesignerData.DataModelInfo.Type === RelationType.OneToMany) {
                  (item as LayoutItemReferenceViewModel).ColumnGuids = resolveAggregationOneToManyColumnGuids(newDesign as LayoutItemReferenceSetting);
                }
              }
              break;
            default:
              break;
          }
          (item as RichLayoutItem).simpleDesignerData.status = getLayoutItemState((item as RichLayoutItem).simpleDesignerData.status, 'modified');
        }
      });

      if (!!action.payload.DefaultSimpleValidation) {
        const ValidationsWithoutChangedItem = currentLayout?.Validations?.filter(item => item.LayoutItemGuid.toLowerCase() !== action.payload.LayoutItemGuid.toLowerCase()) || [];
        currentLayout.Validations = [...ValidationsWithoutChangedItem, ...action.payload.DefaultSimpleValidation];
      }

      if(currentFloor.LayoutType === LayoutType.Define) { 
        currentFloor.FormValidation = formDefineDesignerValidator({ layout: currentLayout });
      } else {
        currentFloor.FormValidation = formArchiveDesignerValidator({ layout: currentLayout });
      }
      
      currentLayout.SimpleDesignerLayoutState = getLayoutState(currentLayout.SimpleDesignerLayoutState, "Modified") ;
      currentFloor.StateVersion += 0.1;
    },
    AddRelationAction: (
      state: Array<SimpleDesignerIStateStack<DefineLayoutSimpleDesignerViewModel>>,
      action: PayloadAction<AddRelationActionPayload>
    ) => {
      const currentFloor = state.find((floor) => floor.LayoutGuid.toLowerCase() === action.payload.LayoutGuid.toLowerCase());
      const currentLayout = currentFloor.LayoutModels.Layouts.find((layout) => layout.Guid.toLowerCase() === action.payload.LayoutGuid.toLowerCase());

      const {
        RowId,
        ReferenceGuid,
        GroupGuid,
        ItemType,
        DesignType,
        Design,
        ColumnId,
        ColumnGuids,
        relationType,
        relationNature,
        relationCandidatesType
      } = action.payload;


      const DesignObj = JSON.parse(currentLayout.Design) as Design;

      const newGuid = utility.newGuid();
      const relationGuid = utility.newGuid();
      currentLayout.Items.push({
        Guid: newGuid,
        ParentGuid: GroupGuid,
        RelationGuid: relationGuid,
        Design: Design,
        Type: LayoutItemType.Reference,
        OrderIndex: currentFloor.Count.Field + 1,
        ColumnGuids: [...ColumnGuids],
        RelationType: relationType,
        RelationNature: relationNature,
        ReferenceDataModelGuid: null,
        simpleDesignerData: {
          status: 'added',
          relationCandidatesType,
          DataModelInfo: {
            Nature: relationType,
            Type: relationNature,
            ReferenceDataModelGuid: null,
            RelationGuid: relationGuid
          }
        }
      } as LayoutItemReferenceViewModel);
      //Add field to column in arrangement
      currentLayout.Design = JSON.stringify(
        {...addFieldToColumn(DesignObj, RowId, ColumnId, DesignType, newGuid),DesignType:0}
      );

      currentFloor.FormValidation = formDefineDesignerValidator({
        layout: currentLayout,
      });
      currentLayout.SimpleDesignerLayoutState = getLayoutState(currentLayout.SimpleDesignerLayoutState, "Modified") ;
      currentLayout.SimpleDesignerDataModelState = getLayoutState(currentLayout.SimpleDesignerDataModelState, "Modified") ;
      currentFloor.Count.Field++;
      currentFloor.StateVersion += 0.1;
    },
    UpdateRelationInformation: (
      state: Array<SimpleDesignerIStateStack<DefineLayoutSimpleDesignerViewModel>>,
      action: PayloadAction<{ data: any } & { LayoutGuid: string; layoutItemGuid: string }>
    ) => {
      const { data, layoutItemGuid } = action.payload;
      const currentFloor = state.find((floor) => floor.LayoutGuid.toLowerCase() === action.payload.LayoutGuid.toLowerCase());
      const currentLayout = currentFloor.LayoutModels.Layouts.find((layout) => layout.Guid.toLowerCase() === action.payload.LayoutGuid.toLowerCase());
      const layoutItem = currentLayout.Items.find(layout => layout.Guid === layoutItemGuid);
      for (let key in data) {
        layoutItem[key] = data[key];
      }
      (layoutItem as RichLayoutItem).simpleDesignerData.status = getLayoutItemState((layoutItem as RichLayoutItem).simpleDesignerData.status,'modified') ;
    },
    AddNewSubLayoutColumnAction: (state: Array<SimpleDesignerIStateStack<ArchiveLayoutSimpleDesignerViewModel>>, action: PayloadAction<AddSubLayoutColumnActionPayload>) => {
      const {
        GroupGuid,
        ItemType,
        Design,
        SubLayoutGuid,
        RowId, 
        ColId,
      } = action.payload;
 
      const currentFloor = state.find((floor) => floor.LayoutGuid.toLowerCase() === action.payload.LayoutGuid.toLowerCase());
      const currentLayout = currentFloor.LayoutModels.Layouts.find((layout) => layout.Guid.toLowerCase() === action.payload.LayoutGuid.toLowerCase());
      const subLayoutNewGuid = utility.newGuid();
      const DesignObj = JSON.parse(currentLayout.Design) as Design;

      const subLayoutFloor = state.find((layout) => layout.LayoutGuid.toLowerCase() === SubLayoutGuid.toLowerCase());
      currentFloor.LayoutModels.Layouts.push(...subLayoutFloor.LayoutModels.Layouts);
      const newDataModelGuid = subLayoutFloor.DataModelGuid;
      const relationGuid = utility.newGuid();
      
      currentLayout.Items.push({
        Guid: subLayoutNewGuid,
        ParentGuid: GroupGuid,
        Design: Design,
        Type: ItemType,
        OrderIndex: currentFloor.Count.Field + 1,
        SubLayoutGuid,
        RelationGuid: relationGuid,
        simpleDesignerData: {
          status: 'added',
          DataModelInfo: {
            Type: RelationType.OneToMany,
            Nature: RelationNature.Composition,
            bookmark: '',
            Name: '',
            label: '',
            RelationGuid: relationGuid,
            ReferenceDataModelGuid: newDataModelGuid
          }
        }
      }  as RichLayoutItem);

      currentLayout.Design = JSON.stringify(
        {...addSubLayoutToColumn({ designObj: DesignObj, arrangementType: ArrangementType.SubLayout, subLayoutItemGuid: subLayoutNewGuid, rowId: RowId, columnId: ColId }),DesignType:0}
      );
      currentLayout.SimpleDesignerLayoutState = getLayoutState(currentLayout.SimpleDesignerLayoutState, "Modified") ;
      currentLayout.SimpleDesignerDataModelState = getLayoutState(currentLayout.SimpleDesignerDataModelState, "Modified") ;
      currentFloor.StateVersion += 0.1;
      currentFloor.Count.Field++;

    },
    AddSubLayoutArchiveDefineAction: (state: Array<SimpleDesignerIStateStack<DefineArchiveLayoutSimpleDesignerViewModel>>, action: PayloadAction<AddSubLayoutArchiveDefineActionPayload>) => {
      const { SubLayoutGuid, LayoutGuid, LayoutType, ItemType } = action.payload;

      const currentFloor = state.find((floor) => floor.LayoutGuid.toLowerCase() === action.payload.LayoutGuid.toLowerCase());
      const currentLayout = currentFloor.LayoutModels.Layouts.find((layout) => layout.Guid.toLowerCase() === action.payload.LayoutGuid.toLowerCase());

      //set defineLayout
      currentLayout.DefineLayoutGuid = SubLayoutGuid;

      const subLayoutFloor = state.find((layout) => layout.LayoutGuid.toLowerCase() === SubLayoutGuid.toLowerCase());
      currentFloor.LayoutModels.Layouts.push(...subLayoutFloor.LayoutModels.Layouts);

      currentFloor.FormValidation = formArchiveDesignerValidator({
        layout: currentLayout,
      });
      currentFloor.StateVersion += 0.1;
    },
    SelectSubLayoutArchiveDefineAction: (state: Array<SimpleDesignerIStateStack<DefineArchiveLayoutSimpleDesignerViewModel>>, action: PayloadAction<SelectSubLayoutArchiveDefineActionPayload<DefineArchiveLayoutSimpleDesignerViewModel>>) => {
      const { subLayoutGuid, layoutType, layouts, LayoutGuid } = action.payload;

      const currentFloor = state.find((floor) => floor.LayoutGuid.toLowerCase() === LayoutGuid.toLowerCase());
      const currentLayout = currentFloor.LayoutModels.Layouts.find((layout) => layout.Guid.toLowerCase() === LayoutGuid.toLowerCase());

      if (layoutType === LayoutType.DefineArchive) {
        currentLayout.DefineLayoutGuid = subLayoutGuid;
      }

      const currentFloorLayoutGuids = currentFloor.LayoutModels.Layouts.map((layout) => layout.Guid.toLowerCase());

      const newLayoutsIsNotExistonTopFloor = layouts.filter((layout) => !currentFloorLayoutGuids.includes(layout.Guid.toLowerCase()));
      currentFloor.LayoutModels.Layouts.push(...newLayoutsIsNotExistonTopFloor);

      currentFloor.FormValidation = formArchiveDesignerValidator({
        layout: currentLayout,
      });

      currentFloor.StateVersion += 0.1;
    },
    AddSelectedSubLayoutColumnAction: (state: Array<SimpleDesignerIStateStack<SimpleDesignerLayoutViewModelWithState>>, action: PayloadAction<SimpleDesignerAddSelectedSubLayoutColumnActionPayload>) => {
      const {
        ItemType,
        Design,
        RelationGuid,
        SubLayoutGuid,
        RowId,
        Layouts,
        GroupGuid,
        ColId,
      } = action.payload;

      const currentFloor = state.find((floor) => floor.LayoutGuid.toLowerCase() === action.payload.LayoutGuid.toLowerCase());
      const currentLayout = currentFloor.LayoutModels.Layouts.find((layout) => layout.Guid.toLowerCase() === action.payload.LayoutGuid.toLowerCase());
      const subLayoutNewGuid = utility.newGuid();
      const DesignObj = JSON.parse(currentLayout.Design) as Design;

      currentLayout.Items.push({
        Guid: subLayoutNewGuid,
        Design: Design,
        Type: ItemType,
        OrderIndex: currentFloor.Count.Field + 1,
        SubLayoutGuid,
        RelationGuid,
        ParentGuid: GroupGuid,
      } as SubLayoutItemViewModel);

      currentLayout.Design = JSON.stringify(
        addSubLayoutToColumn({ designObj: DesignObj, arrangementType: ArrangementType.SubLayout, subLayoutItemGuid: subLayoutNewGuid, rowId: RowId, columnId: ColId })
      );

      const currentFloorLayoutGuids = currentFloor.LayoutModels.Layouts.map((layout) => layout.Guid.toLowerCase());

      const newLayoutsIsNotExistonTopFloor = Layouts.filter((layout) => !currentFloorLayoutGuids.includes(layout.Guid.toLowerCase()));
      currentFloor.LayoutModels.Layouts.push(...newLayoutsIsNotExistonTopFloor);
      currentLayout.SimpleDesignerLayoutState = getLayoutState(currentLayout.SimpleDesignerLayoutState, "Added") ;
      currentLayout.SimpleDesignerDataModelState = getLayoutState(currentLayout.SimpleDesignerDataModelState, "Added") ;
      currentFloor.StateVersion += 0.1;
      currentFloor.Count.Field += 1;

    },
    ToggleArchiveColumn: (state: Array<SimpleDesignerIStateStack<InlineArchiveLayoutSimpleDesignerViewModel>>, action: PayloadAction<ToggleColumnArchiveLayout>) => {
      const { LayoutGuid, ColumnGuid, Design, Selected } = action.payload;
      const currentFloor = state.find((floor) => floor.LayoutGuid.toLowerCase() === LayoutGuid.toLowerCase());
      const currentLayout = currentFloor.LayoutModels.Layouts.find((layout) => layout.Guid.toLowerCase() === action.payload.LayoutGuid.toLowerCase());

      if (Selected) {
        const newGuid = utility.newGuid();
        currentLayout.Items.push({
          Guid: newGuid,
          ParentGuid: null,
          ColumnGuid: ColumnGuid,
          Design: Design,
          Type: LayoutItemType.Column,
          OrderIndex: currentFloor.Count.Field + 1,
        } as LayoutItemColumnViewModel);
      } else {
        const index = currentLayout.Items.findIndex((item) => {
          if (item.Type === LayoutItemType.Column) {
            return (item as LayoutItemColumnViewModel).ColumnGuid.toLowerCase() === ColumnGuid.toLowerCase()
          }
          return false;
        });

        if (index > -1) {
          if (currentLayout.Type === LayoutType.InlineArchive) {
            currentLayout.Validations = currentLayout.Validations.filter((rule) => rule.LayoutItemGuid.toLowerCase() !== currentLayout.Items[index].Guid.toLowerCase());
          }
          const currentLayoutDesign = JSON.parse(currentLayout.Design) as ArchiveLayoutSetting;
          if (!!currentLayoutDesign.Widget.SearchSetting.Enable && currentLayoutDesign.Widget.SearchSetting.LayoutItemGuid.toLowerCase() === currentLayout.Items[index].Guid.toLowerCase()) {
            currentLayoutDesign.Widget.SearchSetting = { Enable: false, LayoutItemGuid: null, ColumnViewModelGuid: null }
            currentLayout.Design = JSON.stringify({...currentLayoutDesign,DesignType:0});
          }
          currentLayout.Items.splice(index, 1);
        }
      }

      currentFloor.FormValidation = formArchiveDesignerValidator({ layout: currentLayout });

      currentFloor.Count.Field++;
      currentLayout.SimpleDesignerLayoutState = getLayoutState(currentLayout.SimpleDesignerLayoutState, "Modified") ;
      currentLayout.SimpleDesignerDataModelState = getLayoutState(currentLayout.SimpleDesignerDataModelState, "Modified") ;
      currentFloor.StateVersion += 0.1; 
    },
    AddArchiveColumn: (state: Array<SimpleDesignerIStateStack<InlineArchiveLayoutSimpleDesignerViewModel>>, action: PayloadAction<ToggleColumnSimpleDesignerArchiveLayout>) => {
      const { LayoutGuid, ColumnGuid, Selected, Design, simpleDesignerWidgetType } = action.payload;
      const currentFloor = state.find((floor) => floor.LayoutGuid.toLowerCase() === LayoutGuid.toLowerCase());
      const currentLayout = currentFloor.LayoutModels.Layouts.find((layout) => layout.Guid.toLowerCase() === action.payload.LayoutGuid.toLowerCase());
      const columnName = getNextAvailableColumnName((currentLayout.Items as unknown as RichLayoutItem[]).filter(item => item.Type === LayoutItemType.Column).map(item => item.simpleDesignerData.DataModelInfo.name));
      const columnLabel = getNextAvailableColumnLabel((currentLayout.Items as unknown as RichLayoutItem[]).filter(item => item.Type === LayoutItemType.Column).map(item => item.simpleDesignerData.DataModelInfo.label));

      const newGuid = utility.newGuid();
      const dataType = convertDesignerVersion2WidgetTypeToDataType(simpleDesignerWidgetType);
      currentLayout.Items.push({
        Guid: newGuid,
        ParentGuid: null,
        ColumnGuid: newGuid,
        Design: Design,
        Type: LayoutItemType.Column,
        OrderIndex: currentFloor.Count.Field + 1,
        simpleDesignerData: {
          status: 'added',
          simpleDesignerWidgetType: simpleDesignerWidgetType,
          DataModelInfo: {
            guid: newGuid,
            name: columnName,
            label: columnLabel,
            dataType,
            setting: getDefaultDataTypeSetting(dataType)
          }
        },
      } as LayoutItemColumnViewModel);

      currentFloor.Count.Field++;
      currentFloor.FormValidation = formArchiveDesignerValidator({ layout: currentLayout });
      currentLayout.SimpleDesignerLayoutState = getLayoutState(currentLayout.SimpleDesignerLayoutState, "Modified") ;
      currentLayout.SimpleDesignerDataModelState = getLayoutState(currentLayout.SimpleDesignerDataModelState, "Modified") ;
      currentFloor.StateVersion += 0.1;
    },
    RemoveArchiveColumn: (state: Array<SimpleDesignerIStateStack<InlineArchiveLayoutSimpleDesignerViewModel>>, action: PayloadAction<{ LayoutGuid: string; ColumnGuid: string }>) => {
      const { LayoutGuid, ColumnGuid } = action.payload;
      const currentFloor = state.find((floor) => floor.LayoutGuid.toLowerCase() === LayoutGuid.toLowerCase());
      const currentLayout = currentFloor.LayoutModels.Layouts.find((layout) => layout.Guid.toLowerCase() === action.payload.LayoutGuid.toLowerCase());

      const index = currentLayout.Items.findIndex((item) => {
        if (item.Type === LayoutItemType.Column) {
          return (item as LayoutItemColumnViewModel).ColumnGuid.toLowerCase() === ColumnGuid.toLowerCase()
        }
        return false;
      });

      if (index > -1) {
        if (currentLayout.Type === LayoutType.InlineArchive) {
          currentLayout.Validations = currentLayout.Validations.filter((rule) => rule.LayoutItemGuid.toLowerCase() !== currentLayout.Items[index].Guid.toLowerCase());
        }
        const currentLayoutDesign = JSON.parse(currentLayout.Design) as ArchiveLayoutSetting;
        if (!!currentLayoutDesign.Widget.SearchSetting.Enable && currentLayoutDesign.Widget.SearchSetting.LayoutItemGuid.toLowerCase() === currentLayout.Items[index].Guid.toLowerCase()) {
          currentLayoutDesign.Widget.SearchSetting = { Enable: false, LayoutItemGuid: null, ColumnViewModelGuid: null }
          currentLayout.Design = JSON.stringify(currentLayoutDesign);
        }
        currentFloor.Count.Field++;
        currentLayout.SimpleDesignerLayoutState = getLayoutState(currentLayout.SimpleDesignerLayoutState, "Modified") ;
        currentLayout.Items.splice(index, 1);
      }
      currentFloor.StateVersion += 0.1;
    },
    ToggleArchiveRelation: (state: Array<SimpleDesignerIStateStack<ArchiveLayoutSimpleDesignerViewModel>>, action: PayloadAction<ToggleRelationArchiveLayout>) => {
      const { LayoutGuid, Design, Selected, ColumnGuids, ReferenceGuid } = action.payload;
      const currentFloor = state.find((floor) => floor.LayoutGuid.toLowerCase() === LayoutGuid.toLowerCase());
      const currentLayout = currentFloor.LayoutModels.Layouts.find((layout) => layout.Guid.toLowerCase() === action.payload.LayoutGuid.toLowerCase());

      if (Selected) {
        const newGuid = utility.newGuid();
        currentLayout.Items.push({
          Guid: newGuid,
          ParentGuid: null,
          RelationGuid: ReferenceGuid,
          Design: Design,
          Type: LayoutItemType.Reference,
          OrderIndex: currentFloor.Count.Field + 1,
          ColumnGuids: [...ColumnGuids],
        } as LayoutItemReferenceViewModel);
      } else {
        const index = currentLayout.Items.findIndex((item) => {
          if (item.Type === LayoutItemType.Reference) {
            return (item as LayoutItemReferenceViewModel).RelationGuid.toLowerCase() === ReferenceGuid.toLowerCase()
          }
          return false
        });
        if (index > -1) {
          currentLayout.Items.splice(index, 1);
        }
      }

      currentFloor.FormValidation = formArchiveDesignerValidator({ layout: currentLayout });

      currentFloor.Count.Field++;
      currentLayout.SimpleDesignerLayoutState = getLayoutState(currentLayout.SimpleDesignerLayoutState, "Modified") ;
      currentLayout.SimpleDesignerDataModelState = getLayoutState(currentLayout.SimpleDesignerDataModelState, "Modified") ;
      currentFloor.StateVersion += 0.1;
    },
    SaveLayoutArchiveInfo: (state: Array<SimpleDesignerIStateStack<ArchiveLayoutSimpleDesignerViewModel>>, action: PayloadAction<SaveArchiveLayoutSetting>) => {
      const currentFloor = state.find((floor) => floor.LayoutGuid.toLowerCase() === action.payload.LayoutGuid.toLowerCase());
      const currentLayout = currentFloor.LayoutModels.Layouts.find((layout) => layout.Guid.toLowerCase() === action.payload.LayoutGuid.toLowerCase());
      const layoutDesign = JSON.parse(currentLayout.Design);
      if(layoutDesign.Widget) {
          currentLayout.Design = JSON.stringify({ ...layoutDesign, Widget: { Id: 0, ...layoutDesign.Widget, ...action.payload.Widget },DesignType:1 });
      } else {
        currentLayout.Design = JSON.stringify({ ...layoutDesign, Widget: { Id: 0, ...action.payload.Widget },DesignType:1 });
      }
      currentLayout.SimpleDesignerLayoutState = getLayoutState(currentLayout.SimpleDesignerLayoutState, "Modified") ;
      currentFloor.StateVersion += 0.1;
      currentFloor.PropertiesDockLayoutState.IsOpen = false;
    },
    UpdateSubLayout: (state: Array<SimpleDesignerIStateStack<ArchiveLayoutSimpleDesignerViewModel>>, action: PayloadAction<UpdateArchiveLayoutActionPayload>) => {
      //innerDesigner
      const currentFloor = state.find((floor) => floor.LayoutGuid.toLowerCase() === action.payload.LayoutGuid.toLowerCase());
      const GuestLayoutGuids: string[] = currentFloor.LayoutModels.Layouts.map((layout) => layout.Guid.toLowerCase());

      const parentFloor = state.find((floor) => floor.LayoutGuid.toLowerCase() === action.payload.ParentLayoutGuid.toLowerCase());

      //remove old layouts from floor
      parentFloor.LayoutModels.Layouts = parentFloor.LayoutModels.Layouts.filter((layout) => !GuestLayoutGuids.includes(layout.Guid.toLowerCase()));
      currentFloor.LayoutModels.Layouts.forEach((layout) => {
        layout.SimpleDesignerLayoutState = getLayoutState(layout.SimpleDesignerDataModelState, "Modified") ;
        layout.SimpleDesignerLayoutState = getLayoutState(layout.SimpleDesignerLayoutState, "Modified") ;
      });

      parentFloor.LayoutModels.Layouts.push(...currentFloor.LayoutModels.Layouts);
      const ParentLayout = parentFloor.LayoutModels.Layouts.find((layout) => layout.Guid.toLowerCase() === action.payload.ParentLayoutGuid.toLowerCase());
      ParentLayout.SimpleDesignerLayoutState = getLayoutState(ParentLayout.SimpleDesignerDataModelState, "Modified") ;
      ParentLayout.SimpleDesignerLayoutState = getLayoutState(ParentLayout.SimpleDesignerLayoutState, "Modified") ;
      parentFloor.StateVersion += 0.1;
    },
    WipeLayout: (state: Array<SimpleDesignerIStateStack<SimpleDesignerLayoutViewModelWithState>>, action: PayloadAction<{ LayoutGuid: string }>) => {
      const currentFloorIndex = state.findIndex((floor) => floor.LayoutGuid.toLowerCase() === action.payload.LayoutGuid.toLowerCase());

      if (currentFloorIndex > 0) {
        state.splice(currentFloorIndex, 1);
      }

    },
    SetFormSetting: (state: Array<SimpleDesignerIStateStack<SimpleDesignerLayoutViewModelWithState>>, action: PayloadAction<{ formName: string; formIsDefault: boolean; LayoutGuid: string }>) => {
      const currentFloor = state.find((floor) => floor.LayoutGuid.toLowerCase() === action.payload.LayoutGuid.toLowerCase());
      const currentLayout = currentFloor.LayoutModels.Layouts.find((layout) => layout.Guid.toLowerCase() === action.payload.LayoutGuid.toLowerCase());

      if (action.payload.formName != null && action.payload.formName.trim() !== "") {
        currentLayout.Label = action.payload.formName;
      }

      if (action.payload.formIsDefault != null) {
        currentLayout.IsDefault = action.payload.formIsDefault;
      }

      if (currentLayout.Type !== LayoutType.Define) {
        currentFloor.FormValidation = formArchiveDesignerValidator({ layout: currentLayout });

      } else {
        currentFloor.FormValidation = formDefineDesignerValidator({ layout: currentLayout });
      }
      currentLayout.SimpleDesignerLayoutState = getLayoutState(currentLayout.SimpleDesignerLayoutState, "Modified") ;
      currentFloor.StateVersion += 0.1;

    },
    SetFormNameSetting: (state: Array<SimpleDesignerIStateStack<SimpleDesignerLayoutViewModelWithState>>, action: PayloadAction<{ formName: string; LayoutGuid: string }>) => {
      const currentFloor = state.find((floor) => floor.LayoutGuid.toLowerCase() === action.payload.LayoutGuid.toLowerCase());
      const currentLayout = currentFloor.LayoutModels.Layouts.find((layout) => layout.Guid.toLowerCase() === action.payload.LayoutGuid.toLowerCase());

      if (action.payload.formName != null && action.payload.formName.trim() !== "") {
        currentLayout.Label = action.payload.formName;
      }

      if (currentLayout.Type !== LayoutType.Define) {
        currentFloor.FormValidation = formArchiveDesignerValidator({ layout: currentLayout });

      } else {
        currentFloor.FormValidation = formDefineDesignerValidator({ layout: currentLayout });
      }
      currentLayout.SimpleDesignerLayoutState = getLayoutState(currentLayout.SimpleDesignerLayoutState, "Modified") ;
      currentFloor.StateVersion += 0.1;

    },
    SetIsDefaultForm: (state: Array<SimpleDesignerIStateStack<SimpleDesignerLayoutViewModelWithState>>, action: PayloadAction<{ IsDefault: boolean; LayoutGuid: string }>) => {
      const currentFloor = state.find((floor) => floor.LayoutGuid.toLowerCase() === action.payload.LayoutGuid.toLowerCase());
      const currentLayout = currentFloor.LayoutModels.Layouts.find((layout) => layout.Guid.toLowerCase() === action.payload.LayoutGuid.toLowerCase());
      currentLayout.IsDefault = action.payload.IsDefault;

      if (currentLayout.Type !== LayoutType.Define) {
        currentFloor.FormValidation = formArchiveDesignerValidator({ layout: currentLayout });

      } else {
        currentFloor.FormValidation = formDefineDesignerValidator({ layout: currentLayout });
      }
      currentLayout.SimpleDesignerLayoutState = getLayoutState(currentLayout.SimpleDesignerLayoutState, "Modified") ;
      currentFloor.StateVersion += 0.1;

    },
    SetDataModelNameSetting: (state: Array<SimpleDesignerIStateStack<SimpleDesignerLayoutViewModelWithState>>, action: PayloadAction<{ dataModelName: string; LayoutGuid: string }>) => {
      const currentFloor = state.find((floor) => floor.LayoutGuid.toLowerCase() === action.payload.LayoutGuid.toLowerCase());
      const currentLayout: any = currentFloor.LayoutModels.Layouts.find((layout) => layout.Guid.toLowerCase() === action.payload.LayoutGuid.toLowerCase());
      if (!currentLayout.DataModelInfo) {
        currentLayout.DataModelInfo = {};
      }

      if (action.payload.dataModelName != null && action.payload.dataModelName.trim() !== "") {
        currentLayout.DataModelInfo.Name = action.payload.dataModelName;
      }

      if (currentLayout.Type !== LayoutType.Define) {
        currentFloor.FormValidation = formArchiveDesignerValidator({ layout: currentLayout });
      } else {
        currentFloor.FormValidation = formDefineDesignerValidator({ layout: currentLayout });
      }
      currentLayout.SimpleDesignerDataModelState = getLayoutState(currentLayout.SimpleDesignerDataModelState, "Modified") ;
      currentFloor.StateVersion += 0.1;

    },
    SetBookmarkSetting: (state: Array<SimpleDesignerIStateStack<SimpleDesignerLayoutViewModelWithState>>, action: PayloadAction<{ Bookmark: string; LayoutGuid: string }>) => {
      const currentFloor = state.find((floor) => floor.LayoutGuid.toLowerCase() === action.payload.LayoutGuid.toLowerCase());
      const currentLayout = currentFloor.LayoutModels.Layouts.find((layout) => layout.Guid.toLowerCase() === action.payload.LayoutGuid.toLowerCase());
      if (!currentLayout.DataModelInfo) {
        currentLayout.DataModelInfo = {};
      }

      if (action.payload.Bookmark != null && action.payload.Bookmark.trim() !== "") {
        currentLayout.DataModelInfo.bookmark = action.payload.Bookmark;
      }

      if (currentLayout.Type !== LayoutType.Define) {
        currentFloor.FormValidation = formArchiveDesignerValidator({ layout: currentLayout });
      } else {
        currentFloor.FormValidation = formDefineDesignerValidator({ layout: currentLayout });
      }
      currentLayout.SimpleDesignerDataModelState = getLayoutState(currentLayout.SimpleDesignerDataModelState, "Modified") ;
      currentFloor.StateVersion += 0.1;

    },
    RemoveDefineArchiveForm: (state: Array<SimpleDesignerIStateStack<DefineArchiveLayoutSimpleDesignerViewModel>>, action: PayloadAction<{ LayoutGuid: string }>) => {
      const currentFloor = state.find((floor) => floor.LayoutGuid.toLowerCase() === action.payload.LayoutGuid.toLowerCase());
      const currentLayout = currentFloor.LayoutModels.Layouts.find((layout) => layout.Guid.toLowerCase() === action.payload.LayoutGuid.toLowerCase());
      const defineLayoutGuid: string = currentLayout.DefineLayoutGuid.toLowerCase();
      const defineLayoutIndex = currentFloor.LayoutModels.Layouts.findIndex((layout) => layout.Guid.toLowerCase() === defineLayoutGuid);

      //set defineLayout
      currentLayout.DefineLayoutGuid = null;

      if (defineLayoutIndex > 0) {
        currentFloor.LayoutModels.Layouts.splice(defineLayoutIndex, 1);
      }

      currentFloor.FormValidation = formArchiveDesignerValidator({
        layout: currentLayout,
      });

      currentLayout.SimpleDesignerLayoutState = getLayoutState(currentLayout.SimpleDesignerLayoutState, "Modified") ;
      currentLayout.SimpleDesignerDataModelState = getLayoutState(currentLayout.SimpleDesignerDataModelState, "Modified") ;
      currentFloor.StateVersion += 0.1;
    },
    AddLayoutSimpleValidation: (state: Array<SimpleDesignerIStateStack<DefineLayoutSimpleDesignerViewModel>>, action: PayloadAction<{ LayoutGuid: string; DesignerValidationGroup: ValidationViewModel[] }>) => {
      const currentFloor = state.find((floor) => floor.LayoutGuid.toLowerCase() === action.payload.LayoutGuid.toLowerCase());
      const currentLayout = currentFloor.LayoutModels.Layouts.find((layout) => layout.Guid.toLowerCase() === action.payload.LayoutGuid.toLowerCase());
      currentLayout.Validations = action.payload.DesignerValidationGroup;
      currentLayout.SimpleDesignerLayoutState = getLayoutState(currentLayout.SimpleDesignerLayoutState, "Modified") ;
      currentFloor.StateVersion += 0.1;
    },
    AddDrawAction: (state: Array<SimpleDesignerIStateStack<DefineLayoutSimpleDesignerViewModel>>, action: PayloadAction<AddDrawingActionPayload>) => {
      const currentFloor = state.find((floor) => floor.LayoutGuid.toLowerCase() === action.payload.LayoutGuid.toLowerCase());
      const currentLayout = currentFloor.LayoutModels.Layouts.find((layout) => layout.Guid.toLowerCase() === action.payload.LayoutGuid.toLowerCase());

      const {
        RowId,
        FieldsetGuid,
        ItemType,
        DesignType,
        Design,
        ColumnId,
        NoneBindableType,
      } = action.payload;

      const DesignObj = JSON.parse(currentLayout.Design) as Design;

      const newGuid = utility.newGuid();
      currentLayout.Items.push({
        Guid: newGuid,
        ParentGuid: FieldsetGuid,
        Design: Design,
        Type: LayoutItemType.NoneBindable,
        OrderIndex: currentFloor.Count.Field + 1,
        simpleDesignerData: {}
      } as LayoutItemNonBindableDesignerViewModel);

      const newDesignObj = addFieldToColumn(DesignObj, RowId, ColumnId, DesignType, newGuid);
      currentLayout.Design = JSON.stringify({...newDesignObj,DesignType:0});
      
      currentFloor.FormValidation = formDefineDesignerValidator({
        layout: currentLayout,
      });
      currentLayout.SimpleDesignerDataModelState = getLayoutState(currentLayout.SimpleDesignerDataModelState, "Modified") ;
      currentLayout.SimpleDesignerLayoutState    = getLayoutState(currentLayout.SimpleDesignerLayoutState, "Modified") ;
      currentFloor.Count = getDesignItemCount(newDesignObj);
      currentFloor.StateVersion += 0.1;
    },
    DragAndDropElement: (state: Array<SimpleDesignerIStateStack<SimpleDesignerLayoutViewModelWithState>>, action: PayloadAction<{ LayoutGuid: string; type: ArrangementType; currentIndex: number; newIndex: number; Id: number; }>) => {
      const { currentIndex, newIndex, type, Id } = action.payload;
      const currentFloor = state.find((floor) => floor.LayoutGuid.toLowerCase() === action.payload.LayoutGuid.toLowerCase());
      const currentLayout = currentFloor.LayoutModels.Layouts.find((layout) => layout.Guid.toLowerCase() === action.payload.LayoutGuid.toLowerCase());
      const currentFormDesign: Design = JSON.parse(currentLayout.Design);

      if (type === ArrangementType.NoneBindableGroup) {
        currentFormDesign.Arrangement = updateLocationFieldset({ list: currentFormDesign.Arrangement, currentIndex, newIndex, Id });
        currentLayout.Design = JSON.stringify({...currentFormDesign,DesignType:0});
      } else if (type === ArrangementType.Row) {
        currentFormDesign.Arrangement = updateLocationRow({ design: currentFormDesign, currentIndex, newIndex, Id });
        currentLayout.Design = JSON.stringify({...currentFormDesign,DesignType:0});
        currentFloor.Count.Row += 1;
      }

      currentFloor.StateVersion += 0.1;
      currentLayout.SimpleDesignerLayoutState = getLayoutState(currentLayout.SimpleDesignerLayoutState, "Modified") ;
    },
    ArchiveOrderColumnChange: (state: Array<SimpleDesignerIStateStack<SimpleDesignerLayoutViewModelWithState>>, action: PayloadAction<{ LayoutGuid: string; layoutItemGuid: string; mode: "Right" | "Left"; newIndex: number }>) => {
      const { LayoutGuid, layoutItemGuid, mode, newIndex } = action.payload;
      const currentFloor = state.find((floor) => floor.LayoutGuid.toLowerCase() === LayoutGuid.toLowerCase());
      const currentLayout = currentFloor.LayoutModels.Layouts.find((layout) => layout.Guid.toLowerCase() === LayoutGuid.toLowerCase());
      const layoutItemIndex = currentLayout.Items.findIndex(item => item.Guid.toLowerCase() === layoutItemGuid.toLowerCase());
      if(newIndex > layoutItemIndex ) {
        currentLayout.Items[layoutItemIndex + 1].OrderIndex -= 1;
      } else {
        currentLayout.Items[layoutItemIndex - 1].OrderIndex += 1;
      }
      const layoutItem = currentLayout.Items[layoutItemIndex];
      layoutItem.OrderIndex = newIndex;
      currentLayout.Items.splice(layoutItemIndex, 1);
      currentLayout.Items.splice(newIndex, 0, layoutItem);

      currentFloor.StateVersion += 0.1;
      currentLayout.SimpleDesignerLayoutState = getLayoutState(currentLayout.SimpleDesignerLayoutState, "Modified") ;
    },
    SetPluginValues: (state: Array<SimpleDesignerIStateStack<SimpleDesignerLayoutViewModelWithState>>, action: PayloadAction<{ plugins: LayoutPluginViewModel[] } & { LayoutGuid: string }>) => {
      const { LayoutGuid, plugins } = action.payload;
      const currentFloor = state.find((floor) => floor.LayoutGuid.toLowerCase() === LayoutGuid.toLowerCase());
      const currentLayout = currentFloor.LayoutModels.Layouts.find((layout) => layout.Guid.toLowerCase() === LayoutGuid.toLowerCase());
      currentLayout.Plugins = plugins;
    },
    SaveLayoutDataModelInfo: (
      state: Array<SimpleDesignerIStateStack<DefineLayoutSimpleDesignerViewModel>>,
      action: PayloadAction<{ LayoutGuid: string; LayoutItemGuid: string; columnProperties: ColumnPropertiesForm; Design: any; simpleDesignerWidgetType: string; }>
    ) => {
      const currentFloor = state.find((floor) => floor.LayoutGuid.toLowerCase() === action.payload.LayoutGuid.toLowerCase());
      const currentLayout = currentFloor.LayoutModels.Layouts.find((layout) => layout.Guid.toLowerCase() === action.payload.LayoutGuid.toLowerCase());

      currentLayout.Items.forEach((item) => {
        if (
          item.Guid.toLowerCase() ===
          action.payload.LayoutItemGuid.toLowerCase()
        ) {
          (item as any).Design = JSON.stringify(action.payload.Design);
          (item as any).simpleDesignerData.simpleDesignerWidgetType = action.payload.simpleDesignerWidgetType;
          (item as any).simpleDesignerData.DataModelInfo = { ...(item as any).simpleDesignerData.DataModelInfo, ...action.payload.columnProperties };
          (item as RichLayoutItem).simpleDesignerData.status = getLayoutItemState((item as RichLayoutItem).simpleDesignerData.status, 'modified');
        }
      });
      if(currentFloor.LayoutType === LayoutType.Define) { 
        currentFloor.FormValidation = formDefineDesignerValidator({ layout: currentLayout });
      } else {
        currentFloor.FormValidation = formArchiveDesignerValidator({ layout: currentLayout });
      }
      currentLayout.SimpleDesignerDataModelState = getLayoutState(currentLayout.SimpleDesignerDataModelState, "Modified") ;

      currentFloor.StateVersion += 0.1;
    },
    SaveRelationInfoToLayoutItem: (
      state: Array<SimpleDesignerIStateStack<DefineLayoutSimpleDesignerViewModel>>,
      action: PayloadAction<{ LayoutGuid: string; LayoutItemGuid: string; ReferenceDataModelGuid: string; RelationNature: number; RelationType: number; ScopeGuid: string; ReferenceDataModelType: number; }>
    ) => {
      const currentFloor = state.find((floor) => floor.LayoutGuid.toLowerCase() === action.payload.LayoutGuid.toLowerCase());
      const currentLayout = currentFloor.LayoutModels.Layouts.find((layout) => layout.Guid.toLowerCase() === action.payload.LayoutGuid.toLowerCase());
      const { ReferenceDataModelGuid, RelationNature, RelationType, ReferenceDataModelType} = action.payload;
      currentLayout.Items.forEach((item) => {
        if ( 
          item.Guid.toLowerCase() ===
          action.payload.LayoutItemGuid.toLowerCase()
        ) {
          (item as any).ReferenceDataModelGuid = ReferenceDataModelGuid;
          (item as any).RelationNature = Number(RelationNature); 
          (item as any).RelationType = Number(RelationType);
          (item as any).simpleDesignerData = {
            relationCandidatesType: (item as RichLayoutItem).simpleDesignerData.relationCandidatesType,
            ScopeGuid: action.payload.ScopeGuid,
            status: getLayoutItemState((item as RichLayoutItem).simpleDesignerData.status, 'modified'),
            DataModelInfo: {
              Nature: Number(RelationNature),
              Type: Number(RelationType),
              ReferenceDataModelGuid: ReferenceDataModelGuid,
              RelationGuid: (item as any).simpleDesignerData.DataModelInfo.RelationGuid,
              ReferenceDataModelType
            }
          };
        }
      });
      currentFloor.FormValidation = formDefineDesignerValidator({ layout: currentLayout });
      currentLayout.SimpleDesignerDataModelState = getLayoutState(currentLayout.SimpleDesignerDataModelState, "Modified") ;
      currentFloor.StateVersion += 0.1;
    }, 
    SaveSimpleDesignerWidgetType: (
      state: Array<SimpleDesignerIStateStack<DefineLayoutSimpleDesignerViewModel>>,
      action: PayloadAction<{ LayoutGuid: string; LayoutItemGuid: string; simpleDesignerWidgetType: string; Design: string}>
    ) => {
      const currentFloor = state.find((floor) => floor.LayoutGuid.toLowerCase() === action.payload.LayoutGuid.toLowerCase());
      const currentLayout = currentFloor.LayoutModels.Layouts.find((layout) => layout.Guid.toLowerCase() === action.payload.LayoutGuid.toLowerCase());
      const { simpleDesignerWidgetType, LayoutItemGuid } = action.payload;
      const dataType = convertDesignerVersion2WidgetTypeToDataType(simpleDesignerWidgetType);
      currentLayout.Items.forEach((item) => {
        if (
          item.Guid.toLowerCase() ===
          LayoutItemGuid.toLowerCase()
        ) {
          item.Design = action.payload.Design;
          (item as RichLayoutItem).simpleDesignerData = { 
              status: 'added',
              simpleDesignerWidgetType: simpleDesignerWidgetType,
              DataModelInfo: {
                guid: item.Guid,
                dataType: dataType,
                setting: getDefaultDataTypeSetting(dataType)
              }
           };
        }
      });
      currentLayout.SimpleDesignerDataModelState = getLayoutState(currentLayout.SimpleDesignerDataModelState, "Modified") ;
      currentLayout.SimpleDesignerLayoutState = getLayoutState(currentLayout.SimpleDesignerLayoutState, "Modified") ;
      currentFloor.StateVersion += 0.1;
    },
  },
  extraReducers: {
    [ValidateFormAsyncAction.fulfilled.toString()]: (state: Array<SimpleDesignerIStateStack<SimpleDesignerLayoutViewModelWithState>>, action: PayloadAction<{ Errors: FormValidationError[]; LayoutGuid: string; }>) => {
      const stateIndex = state.findIndex((floor) => floor.LayoutGuid.toLowerCase() === action.payload.LayoutGuid.toLowerCase());
      state[stateIndex].FormValidation = action.payload.Errors;
    }
  }
});

export const {
  ChangeLoadingState,
  PushLayoutModelAction,
  ChangeActiveTab,
  AddRowAction,
  RemoveRowAction,
  AddColumnAction,
  RemoveColumnAction,
  AddRelationAction,
  SaveFieldSetting,
  AddNewSubLayoutColumnAction,
  AddSubLayoutArchiveDefineAction,
  ToggleArchiveColumn,
  ToggleArchiveRelation,
  SaveLayoutArchiveInfo,
  UpdateSubLayout,
  WipeLayout,
  SetFormSetting,
  RemoveDefineArchiveForm,
  SelectSubLayoutArchiveDefineAction,
  AddSelectedSubLayoutColumnAction,
  AddLayoutSimpleValidation,
  AddDrawAction,
  DragAndDropElement,
  ArchiveOrderColumnChange,
  SetPluginValues,
  SaveLayoutDataModelInfo,
  SaveRelationInfoToLayoutItem,
  UpdateRelationInformation,
  AddArchiveColumn,
  SaveSimpleDesignerWidgetType,
  SetBookmarkSetting,
  SetDataModelNameSetting,
  SetFormNameSetting,
  AddGroupAction,
  RemoveGroupAction,
  RemoveArchiveColumn,
  SetIsDefaultForm,
  openPropertiesItemDockAction,
  closePropertiesItemDockAction,
  openPropertiesDockAction,
  closePropertiesDockAction

} = layoutDesignSlice.actions;

import React from "react";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
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
import { ArrangementType, DefineDesignerTabs, PropertiesDockTabs, DesignerMode } from "../../../../typings/Core.DynamicDataModel/Enums";
import {
  AddColumnActionPayload,
  AddGroupActionPayload,
  AddRelationActionPayload,
  AddRowActionPayload,
  Design,
  FormValidationError,
  LayoutViewModelWithState,
  LayoutItemReferenceSetting,
  LayoutsModel,
  RemoveActionPayload,
  RemoveFieldActionPayload,
  SaveFieldDesignActionPayload,
  SetDesignerTabsPayload,
  SetLoadingPayload,
  IStateStack,
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
  AddSelectedSubLayoutColumnActionPayload,
  DesignerComplexValidationViewModel,
  DefineLayoutDesignerViewModel,
  InlineArchiveLayoutDesignerViewModel,
  DefineArchiveLayoutDesignerViewModel,
  FormEvents,
  ArchiveLayoutSetting,
  ArchiveLayoutDesignerViewModel,
  LayoutDesignerPermission,
  ICLoseProps,
  IWidgetFactory,
  AddDrawingActionPayload,
  LayoutItemNonBindableDesignerViewModel,
} from "../../../../typings/Core.DynamicDataModel/Types";
import { LayoutItemType } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.LayoutItemType";
import { utility } from "didgah/common";
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
import { LayoutPluginViewModel } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.LayoutPluginViewModel";
import { resolveAggregationOneToManyColumnGuids, resolveAggregationOneToOneColumnGuids } from "../strategies/columnGuidStrategies";

export interface PushLayoutModelActionPayload {
  ParentLayoutGuid?: string | null;
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
}

interface ILocalComplexConditionContext {
  widgetFactory: IWidgetFactory;
  currentLayout: LayoutViewModelWithState;
}

export const LocalComplexConditionContext = React.createContext<ILocalComplexConditionContext>({ widgetFactory: null, currentLayout: null });
export const GlobalPropsContext = React.createContext<IGlobalPropsContext>({ layoutGuid: null, mode: null, layoutType: null, closeWindow: null, dataViewModel: null, parentGuid: null, onSaveForm: null, openFormSettingModal: null, permission: { readOnly: false }, context: null, copyFormAppFn: null, plugins: [] });
export const LocalPropsContext = React.createContext<DesignerPanSubLayoutPayload>(null);
const initialState: Array<IStateStack<LayoutViewModelWithState>> = [];

const IsFormValid: (layout: LayoutViewModelWithState) => Promise<Array<FormValidationError>> = async (layout: LayoutViewModelWithState) => {
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
  async (layout: LayoutViewModelWithState) => {
    const response = await IsFormValid(layout);
    return { Errors: response, LayoutGuid: layout.Guid }
  }
)

export const layoutDesignSlice = createSlice({
  name: "layoutDesignStore",
  initialState,
  reducers: {
    TogglePropertiesItemDockAction: (state: Array<IStateStack<LayoutViewModelWithState>>, action: PayloadAction<PropertiesDockItemActionPayload>) => {
      const stateIndex = state.findIndex((floor) => floor.LayoutGuid.toLowerCase() === action.payload.LayoutGuid.toLowerCase());
      const newState = {
        IsOpen: action.payload.IsOpen,
        ActiveSettingTab: action.payload.ActiveSettingTab,
        LayoutItemFocus: action.payload.LayoutItemFocus,
      };
      state[stateIndex].PropertiesDockItemState = newState;
    },
    TogglePropertiesLayoutDockAction: (state: Array<IStateStack<LayoutViewModelWithState>>, action: PayloadAction<PropertiesDockLayoutActionPayload>) => {
      const stateIndex = state.findIndex((floor) => floor.LayoutGuid.toLowerCase() === action.payload.LayoutGuid.toLowerCase());
      const newState = {
        IsOpen: action.payload.IsOpen,
        ActiveSettingTab: action.payload.ActiveSettingTab,
        LayoutFocus: action.payload.LayoutFocus,
        IsFormFocused: true
      };
      state[stateIndex].PropertiesDockLayoutState = newState;
    },
    ChangeLoadingState: (state: Array<IStateStack<LayoutViewModelWithState>>, action: PayloadAction<SetLoadingPayload>) => {
      const stateIndex = state.findIndex((floor) => floor.LayoutGuid.toLowerCase() === action.payload.LayoutGuid.toLowerCase())
      state[stateIndex].IsLoading = action.payload.IsLoading;
    },
    ChangeActiveTab: (state: Array<IStateStack<LayoutViewModelWithState>>, action: PayloadAction<SetDesignerTabsPayload>) => {
      const stateIndex = state.findIndex((floor) => floor.LayoutGuid.toLowerCase() === action.payload.LayoutGuid.toLowerCase());
      state[stateIndex].ActiveTab = action.payload.ActiveTab;
    },
    PushLayoutModelAction: (
      state,
      action: PayloadAction<IStateStack<LayoutViewModelWithState>>
    ) => {
      const currentLayout = action.payload.LayoutModels.Layouts.find((layout) => layout.Guid.toLowerCase() === action.payload.LayoutGuid.toLowerCase());
      const design: Design = JSON.parse(currentLayout.Design);
      const newFloor: IStateStack<LayoutViewModelWithState> = {
        ActiveTab: DefineDesignerTabs.Container,
        IsLoading: false,
        StateVersion: 0,
        FormValidation: [],
        PropertiesDockItemState: {
          IsOpen: false,
          LayoutItemFocus: null,
          ActiveSettingTab: PropertiesDockTabs.Setting
        },
        ...action.payload,
        Count: currentLayout.Type === LayoutType.Define ? getDesignItemCount(design) : { Column: 0, Group: 0, Field: 0, Row: 0 },
      };
      state.push(newFloor);
    },
    AddGroupAction: (state: Array<IStateStack<DefineLayoutDesignerViewModel>>, action: PayloadAction<AddGroupActionPayload>) => {
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
          {
            ...addGroup(
              DesignObj,
              action.payload.NewGroupItem.Guid,
              action.payload.ParentLayoutItemGuid
            ), DesignType: 0
          }
        );

        currentFloor.FormValidation = formDefineDesignerValidator({
          layout: currentLayout,
        });

        if (
          currentLayout.State === "Unchanged"
        ) {
          currentLayout.State = "Modified";
        }
        currentFloor.Count.Group++;
        currentFloor.StateVersion += 0.1;
      }
    },
    RemoveGroupAction: (state: Array<IStateStack<LayoutViewModelWithState>>, action: PayloadAction<RemoveGroupActionPayload>) => {
      const currentFloor = state.find((floor) => floor.LayoutGuid.toLowerCase() === action.payload.LayoutGuid.toLowerCase());
      const currentLayout = currentFloor.LayoutModels.Layouts.find((layout) => layout.Guid.toLowerCase() === action.payload.LayoutGuid.toLowerCase()) as InlineArchiveLayoutDesignerViewModel;

      //Removing Rows from Arrangement
      const DesignObj = JSON.parse(currentLayout.Design) as Design;
      const newDesignObj = removeGroup(DesignObj, action.payload.GroupGuid);
      currentLayout.Design = JSON.stringify({ ...newDesignObj, DesignType: 0 });

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
            const subLayoutChilds = getArchiveDefineChildsLayout({ subLayout: currentFloor.LayoutModels.Layouts[subLayoutIndex] as DefineArchiveLayoutDesignerViewModel, layoutGuid: action.payload.LayoutGuid, layouts: currentFloor.LayoutModels.Layouts })
            const subLayoutChildsGuid = subLayoutChilds.map((layout) => layout.Guid.toLowerCase());
            subLayoutChildsGuid.forEach((guid) => {
              const childSubLayoutToRemoveIndex = currentFloor.LayoutModels.Layouts.findIndex((layout) => layout.Guid.toLowerCase() === guid.toLowerCase());
              currentFloor.LayoutModels.Layouts.splice(childSubLayoutToRemoveIndex, 1);
            });
          }

          const subLayoutToRemoveIndex = currentFloor.LayoutModels.Layouts.findIndex((layout) => layout.Guid.toLowerCase() === sublayout.SubLayoutGuid.toLowerCase());
          if (currentFloor.LayoutModels.Layouts[subLayoutToRemoveIndex].State === "Added") {
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

      if (
        currentLayout.State === "Unchanged"
      ) {
        currentLayout.State = "Modified";
      }
      currentFloor.Count = getDesignItemCount(newDesignObj);
      currentFloor.StateVersion += 0.1;
    },
    AddRowAction: (state: Array<IStateStack<DefineLayoutDesignerViewModel>>, action: PayloadAction<AddRowActionPayload>) => {
      const currentFloor = state.find((floor) => floor.LayoutGuid.toLowerCase() === action.payload.LayoutGuid.toLowerCase());
      const currentLayout = currentFloor.LayoutModels.Layouts.find((layout) => layout.Guid.toLowerCase() === action.payload.LayoutGuid.toLowerCase());

      const DesignObj = JSON.parse(currentLayout.Design) as Design;

      const newDesignObj = addRowToGroup({
        designObj: DesignObj,
        LayoutItemGuid: action.payload.LayoutItemGroupGuid,
        Cols: action.payload.Cols,
        RowId: action.payload.RowId,
      });

      currentLayout.Design = JSON.stringify({ ...newDesignObj, DesignType: 0 });
      currentFloor.FormValidation = formDefineDesignerValidator({
        layout: currentLayout,
      });

      if (
        currentLayout.State === "Unchanged"
      ) {
        currentLayout.State = "Modified";
      }
      currentFloor.Count = getDesignItemCount(newDesignObj);
      currentFloor.StateVersion += 0.1;
    },
    RemoveRowAction: (state: Array<IStateStack<LayoutViewModelWithState>>, action: PayloadAction<RemoveActionPayload>) => {
      const currentFloor = state.find((floor) => floor.LayoutGuid.toLowerCase() === action.payload.LayoutGuid.toLowerCase());
      const currentLayout = currentFloor.LayoutModels.Layouts.find((layout) => layout.Guid.toLowerCase() === action.payload.LayoutGuid.toLowerCase()) as InlineArchiveLayoutDesignerViewModel;

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
            const subLayoutChilds = getArchiveDefineChildsLayout({ subLayout: currentFloor.LayoutModels.Layouts[subLayoutIndex] as DefineArchiveLayoutDesignerViewModel, layoutGuid: action.payload.LayoutGuid, layouts: currentFloor.LayoutModels.Layouts })
            const subLayoutChildsGuid = subLayoutChilds.map((layout) => layout.Guid.toLowerCase());
            subLayoutChildsGuid.forEach((guid) => {
              const childSubLayoutToRemoveIndex = currentFloor.LayoutModels.Layouts.findIndex((layout) => layout.Guid.toLowerCase() === guid.toLowerCase());
              currentFloor.LayoutModels.Layouts.splice(childSubLayoutToRemoveIndex, 1);
            });
          }

          const subLayoutToRemoveIndex = currentFloor.LayoutModels.Layouts.findIndex((layout) => layout.Guid.toLowerCase() === sublayout.SubLayoutGuid.toLowerCase());
          if (currentFloor.LayoutModels.Layouts[subLayoutToRemoveIndex].State === "Added") {
            currentFloor.LayoutModels.Layouts.splice(subLayoutToRemoveIndex, 1);
          }
        });
      }

      const newDesignObj = removeRowFromGroup(
        DesignObj,
        action.payload.LayoutItemGroupGuid,
        action.payload.RowId
      );

      currentLayout.Design = JSON.stringify({ ...newDesignObj, DesignType: 0 });
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
      if (
        currentLayout.State === "Unchanged"
      ) {
        currentLayout.State = "Modified";
      }
      currentFloor.Count = getDesignItemCount(newDesignObj);
      currentFloor.StateVersion += 0.1;
    },
    AddColumnAction: (state: Array<IStateStack<DefineLayoutDesignerViewModel>>, action: PayloadAction<AddColumnActionPayload>) => {
      const currentFloor = state.find((floor) => floor.LayoutGuid.toLowerCase() === action.payload.LayoutGuid.toLowerCase());
      const currentLayout = currentFloor.LayoutModels.Layouts.find((layout) => layout.Guid.toLowerCase() === action.payload.LayoutGuid.toLowerCase());

      const {
        RowId,
        ColumnlGuid,
        GroupGuid,
        ItemType,
        DesignType,
        Design,
        ColumnId,
        LayoutItemGuid
      } = action.payload;

      const DesignObj = JSON.parse(currentLayout.Design) as Design;
      currentLayout.Items.push({
        Guid: LayoutItemGuid,
        ParentGuid: GroupGuid,
        ColumnGuid: ColumnlGuid,
        Design: Design,
        Type: LayoutItemType.Column,
        OrderIndex: currentFloor.Count.Field + 1,
      } as LayoutItemColumnViewModel);
      //Add field to column in arrangement

      const newDesignObj = addFieldToColumn(DesignObj, RowId, ColumnId, DesignType, LayoutItemGuid);
      currentLayout.Design = JSON.stringify({ ...newDesignObj, DesignType: 0 });
      currentFloor.FormValidation = formDefineDesignerValidator({
        layout: currentLayout,
      });

      if (
        currentLayout.State === "Unchanged"
      ) {
        currentLayout.State = "Modified";
      }
      currentFloor.Count = getDesignItemCount(newDesignObj);
      currentFloor.StateVersion += 0.1;
      currentLayout.Validations = [...currentLayout.Validations, ...action.payload.validations];
    },
    RemoveColumnAction: (
      state: Array<IStateStack<LayoutViewModelWithState>>,
      action: PayloadAction<RemoveFieldActionPayload>
    ) => {
      const currentFloor = state.find((floor) => floor.LayoutGuid.toLowerCase() === action.payload.LayoutGuid.toLowerCase());
      const currentLayout = currentFloor.LayoutModels.Layouts.find((layout) => layout.Guid.toLowerCase() === action.payload.LayoutGuid.toLowerCase()) as DefineLayoutDesignerViewModel;

      const DesignLayoutObj = JSON.parse(currentLayout.Design) as Design;

      const layoutItem = currentLayout.Items.find((item) => item.Guid.toLowerCase() === action.payload.LayoutItemGuid.toLowerCase());

      currentLayout.Validations = currentLayout.Validations.filter((rule) => rule.LayoutItemGuid.toLowerCase() !== action.payload.LayoutItemGuid.toLowerCase());

      if (layoutItem.Type === LayoutItemType.SubLayout) {
        const subLayoutToRemoveIndex = currentFloor.LayoutModels.Layouts.findIndex((layout) => layout.Guid.toLowerCase() === (layoutItem as SubLayoutItemViewModel).SubLayoutGuid.toLowerCase());

        if (currentFloor.LayoutModels.Layouts[subLayoutToRemoveIndex].Type === LayoutType.DefineArchive) {
          const subLayoutChilds = getArchiveDefineChildsLayout({ subLayout: currentFloor.LayoutModels.Layouts[subLayoutToRemoveIndex] as DefineArchiveLayoutDesignerViewModel, layoutGuid: action.payload.LayoutGuid, layouts: currentFloor.LayoutModels.Layouts })
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

      currentLayout.Design = JSON.stringify({ ...newObjectDesign, DesignType: 0 });

      currentFloor.FormValidation = formDefineDesignerValidator({
        layout: currentLayout,
      });

      if (
        currentLayout.State === "Unchanged"
      ) {
        currentLayout.State = "Modified";
      }

      currentFloor.Count = getDesignItemCount(newObjectDesign);
      currentFloor.StateVersion += 0.1;
    },
    SaveFieldSetting: (
      state: Array<IStateStack<DefineLayoutDesignerViewModel>>,
      action: PayloadAction<SaveFieldDesignActionPayload>
    ) => {
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
              const currentDataViewModel = currentFloor.LayoutModels.DataModels.find((model) => model.Guid.toLowerCase() === currentLayout.DataModelGuid.toLowerCase());
              const currentLayoutItem = currentLayout.Items.find((item) => item.Guid.toLowerCase() === action.payload.LayoutItemGuid.toLowerCase());
              const layoutItemReference = currentDataViewModel.Relations.find((relation) => relation.Guid.toLowerCase() === (currentLayoutItem as LayoutItemReferenceViewModel).RelationGuid.toLowerCase()
              );
              const referenceDataMdel = currentFloor.LayoutModels.DataModels.find((model) => model.Guid.toLowerCase() === layoutItemReference.ReferenceDataModelGuid.toLowerCase());

              if (referenceDataMdel.Type === DataModelType.Software) {
                (item as LayoutItemReferenceViewModel).ColumnGuids = [];
              } else {
                if (layoutItemReference.Nature === RelationNature.Aggregation && layoutItemReference.Type == RelationType.OneToOne) {
                  if ((newDesign as LayoutItemReferenceSetting).CascadeDropDownLevel) {
                    break;
                  }
                  (item as LayoutItemReferenceViewModel).ColumnGuids = resolveAggregationOneToOneColumnGuids(newDesign as LayoutItemReferenceSetting);
                } else if (layoutItemReference.Nature === RelationNature.Aggregation && layoutItemReference.Type === RelationType.OneToMany) {
                  (item as LayoutItemReferenceViewModel).ColumnGuids = resolveAggregationOneToManyColumnGuids(newDesign as LayoutItemReferenceSetting);
                }
              }
              break;
            default:
              break;
          }
        }
      });

      if (!!action.payload.DefaultSimpleValidation) {
        const ValidationsWithoutChangedItem = currentLayout?.Validations?.filter(item => item.LayoutItemGuid.toLowerCase() !== action.payload.LayoutItemGuid.toLowerCase()) || [];
        currentLayout.Validations = [...ValidationsWithoutChangedItem, ...action.payload.DefaultSimpleValidation];
      }

      if (
        currentLayout.State === "Unchanged"
      ) {
        currentLayout.State = "Modified";
      }

      currentFloor.StateVersion += 0.1;
    },
    AddRelationAction: (
      state: Array<IStateStack<DefineLayoutDesignerViewModel>>,
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
      } = action.payload;

      const DesignObj = JSON.parse(currentLayout.Design) as Design;
      const newGuid = utility.newGuid();
      currentLayout.Items.push({
        Guid: newGuid,
        ParentGuid: GroupGuid,
        RelationGuid: ReferenceGuid,
        Design: Design,
        Type: LayoutItemType.Reference,
        OrderIndex: currentFloor.Count.Field + 1,
        ColumnGuids: [...ColumnGuids],
      } as LayoutItemReferenceViewModel);
      //Add field to column in arrangement
      currentLayout.Design = JSON.stringify(
        { ...addFieldToColumn(DesignObj, RowId, ColumnId, DesignType, newGuid), DesignType: 0 }
      );

      currentFloor.FormValidation = formDefineDesignerValidator({
        layout: currentLayout,
      });
      if (
        currentLayout.State === "Unchanged"
      ) {
        currentLayout.State = "Modified";
      }
      currentFloor.Count.Field++;
      currentFloor.StateVersion += 0.1;
    },
    AddNewSubLayoutColumnAction: (state: Array<IStateStack<ArchiveLayoutDesignerViewModel>>, action: PayloadAction<AddSubLayoutColumnActionPayload>) => {
      const {
        GroupGuid,
        ItemType,
        Design,
        RelationGuid,
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
      currentLayout.Items.push({
        Guid: subLayoutNewGuid,
        ParentGuid: GroupGuid,
        Design: Design,
        Type: ItemType,
        OrderIndex: currentFloor.Count.Field + 1,
        SubLayoutGuid,
        RelationGuid,
      } as SubLayoutItemViewModel);

      currentLayout.Design = JSON.stringify(
        { ...addSubLayoutToColumn({ designObj: DesignObj, arrangementType: ArrangementType.SubLayout, subLayoutItemGuid: subLayoutNewGuid, rowId: RowId, columnId: ColId }), DesignType: 0 }
      );

      if (
        currentLayout.State === "Unchanged"
      ) {
        currentLayout.State = "Modified";
      }

      currentFloor.StateVersion += 0.1;
      currentFloor.Count.Field++;

    },
    AddSubLayoutArchiveDefineAction: (state: Array<IStateStack<DefineArchiveLayoutDesignerViewModel>>, action: PayloadAction<AddSubLayoutArchiveDefineActionPayload>) => {
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
    SelectSubLayoutArchiveDefineAction: (state: Array<IStateStack<DefineArchiveLayoutDesignerViewModel>>, action: PayloadAction<SelectSubLayoutArchiveDefineActionPayload<DefineArchiveLayoutDesignerViewModel>>) => {
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
    AddSelectedSubLayoutColumnAction: (state: Array<IStateStack<LayoutViewModelWithState>>, action: PayloadAction<AddSelectedSubLayoutColumnActionPayload>) => {
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
        { ...addSubLayoutToColumn({ designObj: DesignObj, arrangementType: ArrangementType.SubLayout, subLayoutItemGuid: subLayoutNewGuid, rowId: RowId, columnId: ColId }), DesignType: 0 }
      );

      const currentFloorLayoutGuids = currentFloor.LayoutModels.Layouts.map((layout) => layout.Guid.toLowerCase());

      const newLayoutsIsNotExistonTopFloor = Layouts.filter((layout) => !currentFloorLayoutGuids.includes(layout.Guid.toLowerCase()));
      currentFloor.LayoutModels.Layouts.push(...newLayoutsIsNotExistonTopFloor);

      if (
        currentLayout.State === "Unchanged"
      ) {
        currentLayout.State = "Modified";
      }

      currentFloor.StateVersion += 0.1;
      currentFloor.Count.Field += 1;

    },
    ToggleArchiveColumn: (state: Array<IStateStack<InlineArchiveLayoutDesignerViewModel>>, action: PayloadAction<ToggleColumnArchiveLayout>) => {
      const { LayoutGuid, ColumnGuid, Design, Selected } = action.payload;
      const currentFloor = state.find((floor) => floor.LayoutGuid.toLowerCase() === LayoutGuid.toLowerCase());
      const currentLayout = currentFloor.LayoutModels.Layouts.find((layout) => layout.Guid.toLowerCase() === action.payload.LayoutGuid.toLowerCase());

      if (currentFloor.Count.Field === 0) currentFloor.Count.Field = action.payload.selectedItems;
      if (Selected) {
        const newGuid = utility.newGuid();
        currentLayout.Items.push({
          Guid: newGuid,
          ParentGuid: null,
          ColumnGuid: ColumnGuid,
          Design: Design,
          Type: LayoutItemType.Column,
          OrderIndex: !!currentFloor.Count.Field ? currentFloor.Count.Field + 1 : action.payload.selectedItems + 1,
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
            currentLayout.Design = JSON.stringify({ ...currentLayoutDesign, DesignType: 0 });
          }
          currentLayout.Items.splice(index, 1);
        }
      }

      currentFloor.FormValidation = formArchiveDesignerValidator({ layout: currentLayout });
      currentFloor.Count.Field++;
      if (
        currentLayout.State === "Unchanged"
      ) {
        currentLayout.State = "Modified";
      }
      currentFloor.StateVersion += 0.1;
    },
    ToggleArchiveRelation: (state: Array<IStateStack<ArchiveLayoutDesignerViewModel>>, action: PayloadAction<ToggleRelationArchiveLayout>) => {
      const { LayoutGuid, Design, Selected, ColumnGuids, ReferenceGuid } = action.payload;
      const currentFloor = state.find((floor) => floor.LayoutGuid.toLowerCase() === LayoutGuid.toLowerCase());
      const currentLayout = currentFloor.LayoutModels.Layouts.find((layout) => layout.Guid.toLowerCase() === action.payload.LayoutGuid.toLowerCase());

      if (currentFloor.Count.Field === 0) currentFloor.Count.Field = action.payload.selectedItems
      if (Selected) {
        const newGuid = utility.newGuid();
        currentLayout.Items.push({
          Guid: newGuid,
          ParentGuid: null,
          RelationGuid: ReferenceGuid,
          Design: Design,
          Type: LayoutItemType.Reference,
          OrderIndex: !!currentFloor.Count.Field ? currentFloor.Count.Field + 1 : action.payload.selectedItems + 1,
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
      if (
        currentLayout.State === "Unchanged"
      ) {
        currentLayout.State = "Modified";
      }
      currentFloor.StateVersion += 0.1;
    },
    SaveLayoutArchiveSetting: (state: Array<IStateStack<ArchiveLayoutDesignerViewModel>>, action: PayloadAction<SaveArchiveLayoutSetting>) => {
      const currentFloor = state.find((floor) => floor.LayoutGuid.toLowerCase() === action.payload.LayoutGuid.toLowerCase());
      const currentLayout = currentFloor.LayoutModels.Layouts.find((layout) => layout.Guid.toLowerCase() === action.payload.LayoutGuid.toLowerCase());
      const layoutDesign = JSON.parse(currentLayout.Design);

      currentLayout.Design = JSON.stringify({ ...layoutDesign, Widget: { Id: 0, ...action.payload.Widget }, DesignType: 1 });

      if (
        currentLayout.State === "Unchanged"
      ) {
        currentLayout.State = "Modified";
      }

      currentFloor.StateVersion += 0.1;
      currentFloor.PropertiesDockLayoutState.IsOpen = false;
    },
    UpdateSubLayout: (state: Array<IStateStack<ArchiveLayoutDesignerViewModel>>, action: PayloadAction<UpdateArchiveLayoutActionPayload>) => {
      //innerDesigner
      const currentFloor = state.find((floor) => floor.LayoutGuid.toLowerCase() === action.payload.LayoutGuid.toLowerCase());
      const GuestLayoutGuids: string[] = currentFloor.LayoutModels.Layouts.map((layout) => layout.Guid.toLowerCase());

      const parentFloor = state.find((floor) => floor.LayoutGuid.toLowerCase() === action.payload.ParentLayoutGuid.toLowerCase());
      //remove old layouts from floor
      parentFloor.LayoutModels.Layouts = parentFloor.LayoutModels.Layouts.filter((layout) => !GuestLayoutGuids.includes(layout.Guid.toLowerCase()));

      currentFloor.LayoutModels.Layouts.forEach((layout) => {
        if (layout.State === "Unchanged") {
          layout.State = "Modified";
        }
      });

      parentFloor.LayoutModels.Layouts.push(...currentFloor.LayoutModels.Layouts);

      const ParentLayout = parentFloor.LayoutModels.Layouts.find((layout) => layout.Guid.toLowerCase() === action.payload.ParentLayoutGuid.toLowerCase());
      if (
        ParentLayout.State === "Unchanged"
      ) {
        ParentLayout.State = "Modified";
      }
      parentFloor.StateVersion += 0.1;
    },
    WipeLayout: (state: Array<IStateStack<LayoutViewModelWithState>>, action: PayloadAction<{ LayoutGuid: string }>) => {
      const currentFloorIndex = state.findIndex((floor) => floor.LayoutGuid.toLowerCase() === action.payload.LayoutGuid.toLowerCase());
      if (currentFloorIndex > 0) {
        state.splice(currentFloorIndex, 1);
      }

    },
    SetFormSetting: (state: Array<IStateStack<LayoutViewModelWithState>>, action: PayloadAction<{ formName: string; formIsDefault: boolean; showFormItemLabelInSepratedRow: boolean; LayoutGuid: string; }>) => {
      const currentFloor = state.find((floor) => floor.LayoutGuid.toLowerCase() === action.payload.LayoutGuid.toLowerCase());
      const currentLayout = currentFloor.LayoutModels.Layouts.find((layout) => layout.Guid.toLowerCase() === action.payload.LayoutGuid.toLowerCase());
      if (action.payload.formName != null && action.payload.formName.trim() !== "") {
        currentLayout.Label = action.payload.formName;
      }

      if (action.payload.formIsDefault != null) {
        currentLayout.IsDefault = action.payload.formIsDefault;
        if (currentLayout.State === "Unchanged") {
          currentLayout.State = "Modified";
        }
      }

      if (action.payload.showFormItemLabelInSepratedRow != null) {
        currentLayout.ShowFormItemLabelInSepratedRow = action.payload.showFormItemLabelInSepratedRow;
        if (currentLayout.State === "Unchanged") {
          currentLayout.State = "Modified";
        }
      }

      if (currentLayout.Type !== LayoutType.Define) {
        currentFloor.FormValidation = formArchiveDesignerValidator({ layout: currentLayout });
        if (currentLayout.State === "Unchanged") {
          currentLayout.State = "Modified";
        }
      } else {
        currentFloor.FormValidation = formDefineDesignerValidator({ layout: currentLayout });
        if (currentLayout.State === "Unchanged") {
          currentLayout.State = "Modified";
        }
      }


      currentFloor.StateVersion += 0.1;

    },
    RemoveDefineArchiveForm: (state: Array<IStateStack<DefineArchiveLayoutDesignerViewModel>>, action: PayloadAction<{ LayoutGuid: string }>) => {
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

      if (
        currentLayout.State === "Unchanged"
      ) {
        currentLayout.State = "Modified";
      }
      currentFloor.StateVersion += 0.1;
    },
    AddLayoutComplexValidation: (state: Array<IStateStack<DefineLayoutDesignerViewModel>>, action: PayloadAction<{ LayoutGuid: string; DesignerValidationGroup: DesignerComplexValidationViewModel[] }>) => {
      const currentFloor = state.find((floor) => floor.LayoutGuid.toLowerCase() === action.payload.LayoutGuid.toLowerCase());
      const currentLayout = currentFloor.LayoutModels.Layouts.find((layout) => layout.Guid.toLowerCase() === action.payload.LayoutGuid.toLowerCase());
      currentLayout.ComplexValidations = action.payload.DesignerValidationGroup;

      if (
        currentLayout.State === "Unchanged"
      ) {
        currentLayout.State = "Modified";
      }
      currentFloor.StateVersion += 0.1;
    },
    UpdateOperationOnEvents: (state: Array<IStateStack<LayoutViewModelWithState>>, action: PayloadAction<{ LayoutGuid: string; OperationOnEvents: FormEvents[] }>) => {
      const currentFloor = state.find((floor) => floor.LayoutGuid.toLowerCase() === action.payload.LayoutGuid.toLowerCase());
      const currentLayout = currentFloor.LayoutModels.Layouts.find((layout) => layout.Guid.toLowerCase() === action.payload.LayoutGuid.toLowerCase());
      switch (currentLayout.Type) {
        case LayoutType.Define:
          const currentDesignDefine = JSON.parse(currentLayout.Design) as Design;
          currentDesignDefine.Events = action.payload.OperationOnEvents;
          currentLayout.Design = JSON.stringify({ ...currentDesignDefine, DesignType: 0 });
          break;
        case LayoutType.InlineArchive:
          const currentDesignArchive = JSON.parse(currentLayout.Design) as ArchiveLayoutSetting;
          currentDesignArchive.Events = action.payload.OperationOnEvents;
          currentLayout.Design = JSON.stringify({ ...currentDesignArchive, DesignType: 0 });
          break;
      }

      if (
        currentLayout.State === "Unchanged"
      ) {
        currentLayout.State = "Modified";
      }
      currentFloor.StateVersion += 0.1;
    },
    AddLayoutSimpleValidation: (state: Array<IStateStack<DefineLayoutDesignerViewModel>>, action: PayloadAction<{ LayoutGuid: string; DesignerValidationGroup: ValidationViewModel[] }>) => {
      const currentFloor = state.find((floor) => floor.LayoutGuid.toLowerCase() === action.payload.LayoutGuid.toLowerCase());
      const currentLayout = currentFloor.LayoutModels.Layouts.find((layout) => layout.Guid.toLowerCase() === action.payload.LayoutGuid.toLowerCase());
      currentLayout.Validations = action.payload.DesignerValidationGroup;

      if (
        currentLayout.State === "Unchanged"
      ) {
        currentLayout.State = "Modified";
      }
      currentFloor.StateVersion += 0.1;
    },
    AddDrawAction: (state: Array<IStateStack<DefineLayoutDesignerViewModel>>, action: PayloadAction<AddDrawingActionPayload>) => {
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
      } as LayoutItemNonBindableDesignerViewModel);

      const newDesignObj = addFieldToColumn(DesignObj, RowId, ColumnId, DesignType, newGuid);
      currentLayout.Design = JSON.stringify({ ...newDesignObj, DesignType: 0 });

      currentFloor.FormValidation = formDefineDesignerValidator({
        layout: currentLayout,
      });

      if (
        currentLayout.State === "Unchanged"
      ) {
        currentLayout.State = "Modified";
      }
      currentFloor.Count = getDesignItemCount(newDesignObj);
      currentFloor.StateVersion += 0.1;
    },
    DragAndDropElement: (state: Array<IStateStack<LayoutViewModelWithState>>, action: PayloadAction<{ LayoutGuid: string; type: ArrangementType; currentIndex: number; newIndex: number; Id: number; }>) => {
      const { currentIndex, newIndex, type, Id } = action.payload;
      const currentFloor = state.find((floor) => floor.LayoutGuid.toLowerCase() === action.payload.LayoutGuid.toLowerCase());
      const currentLayout = currentFloor.LayoutModels.Layouts.find((layout) => layout.Guid.toLowerCase() === action.payload.LayoutGuid.toLowerCase());
      const currentFormDesign: Design = JSON.parse(currentLayout.Design);

      if (type === ArrangementType.NoneBindableGroup) {
        const noneBindableGroupItems = currentLayout.Items.filter(i => i.Type === LayoutItemType.NoneBindable);
        currentFormDesign.Arrangement = updateLocationFieldset({ list: currentFormDesign.Arrangement, currentIndex, newIndex, Id });
        currentFormDesign.Arrangement.forEach((value, index) => {
          const item = noneBindableGroupItems.find(item => item.Guid === value.LayoutItemGuid);
          item.OrderIndex = index + 1;
        })
        currentLayout.Design = JSON.stringify({ ...currentFormDesign, DesignType: 0 });
      } else if (type === ArrangementType.Row) {
        currentFormDesign.Arrangement = updateLocationRow({ design: currentFormDesign, currentIndex, newIndex, Id });
        currentLayout.Design = JSON.stringify({ ...currentFormDesign, DesignType: 0 });
        currentFloor.Count.Row += 1;
      }

      currentFloor.StateVersion += 0.1;
      if (
        currentLayout.State === "Unchanged"
      ) {
        currentLayout.State = "Modified";
      }
    },
    ArchiveOrderColumnChange: (state: Array<IStateStack<LayoutViewModelWithState>>, action: PayloadAction<{ LayoutGuid: string; layoutItemGuid: string; mode: "Right" | "Left" }>) => {
      const { LayoutGuid, layoutItemGuid, mode } = action.payload;

      const currentFloor = state.find((floor) => floor.LayoutGuid.toLowerCase() === LayoutGuid.toLowerCase());
      const currentLayout = currentFloor.LayoutModels.Layouts.find((layout) => layout.Guid.toLowerCase() === LayoutGuid.toLowerCase());
      const layoutItemIndex = currentLayout.Items.findIndex(item => item.Guid.toLowerCase() === layoutItemGuid.toLowerCase());
      const layoutItem = currentLayout.Items[layoutItemIndex];
      if (mode == "Left") {
        const swapOrderIndex = layoutItem.OrderIndex;
        const sideLayoutItem = currentLayout.Items.find(item => item.OrderIndex === swapOrderIndex + 1);
        layoutItem.OrderIndex = sideLayoutItem.OrderIndex;
        sideLayoutItem.OrderIndex = swapOrderIndex;
      } else {
        const swapOrderIndex = layoutItem.OrderIndex;
        const sideLayoutItem = currentLayout.Items.find(item => item.OrderIndex === swapOrderIndex - 1);
        layoutItem.OrderIndex = sideLayoutItem.OrderIndex;
        sideLayoutItem.OrderIndex = swapOrderIndex;
      }

      currentFloor.StateVersion += 0.1;
      if (
        currentLayout.State === "Unchanged"
      ) {
        currentLayout.State = "Modified";
      }

    },
    SetPluginValues: (state: Array<IStateStack<LayoutViewModelWithState>>, action: PayloadAction<{ plugins: LayoutPluginViewModel[] } & { LayoutGuid: string }>) => {
      const { LayoutGuid, plugins } = action.payload;
      const currentFloor = state.find((floor) => floor.LayoutGuid.toLowerCase() === LayoutGuid.toLowerCase());
      const currentLayout = currentFloor.LayoutModels.Layouts.find((layout) => layout.Guid.toLowerCase() === LayoutGuid.toLowerCase());
      currentLayout.Plugins = plugins;
      ;
    },
    SetDataModelVariables: (state: Array<IStateStack<LayoutViewModelWithState>>, action: PayloadAction<{ RelationGuid: string, VariableGuid: string, LayoutGuid: string }>) => {
      const { LayoutGuid, RelationGuid, VariableGuid } = action.payload;
      const currentFloor = state.find((floor) => floor.LayoutGuid.toLowerCase() === LayoutGuid.toLowerCase());
      const currentLayout = currentFloor.LayoutModels.Layouts.find((layout) => layout.Guid.toLowerCase() === LayoutGuid.toLowerCase());

      if (currentLayout?.Variables && currentLayout?.Variables.Added && currentLayout?.Variables.Added.length > 0) {
        const findIndex = currentLayout.Variables.Added.findIndex(a => a.RelationGuid === RelationGuid)
        if (findIndex === -1) {
          currentLayout.Variables.Added.push({ RelationGuid, VariableGuid })
        } else currentLayout.Variables.Added[findIndex].VariableGuid = VariableGuid
      }
      else currentLayout.Variables = { Added: [{ RelationGuid, VariableGuid }] }
    }
  },
  extraReducers: {
    [ValidateFormAsyncAction.fulfilled.toString()]: (state: Array<IStateStack<LayoutViewModelWithState>>, action: PayloadAction<{ Errors: FormValidationError[]; LayoutGuid: string; }>) => {
      const stateIndex = state.findIndex((floor) => floor.LayoutGuid.toLowerCase() === action.payload.LayoutGuid.toLowerCase());
      state[stateIndex].FormValidation = action.payload.Errors;
    }
  }
});

export const {
  TogglePropertiesItemDockAction,
  TogglePropertiesLayoutDockAction,
  ChangeLoadingState,
  PushLayoutModelAction,
  AddGroupAction,
  ChangeActiveTab,
  RemoveGroupAction,
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
  SaveLayoutArchiveSetting,
  UpdateSubLayout,
  WipeLayout,
  SetFormSetting,
  RemoveDefineArchiveForm,
  SelectSubLayoutArchiveDefineAction,
  AddSelectedSubLayoutColumnAction,
  AddLayoutComplexValidation,
  AddLayoutSimpleValidation,
  UpdateOperationOnEvents,
  AddDrawAction,
  DragAndDropElement,
  ArchiveOrderColumnChange,
  SetPluginValues,
  SetDataModelVariables
} = layoutDesignSlice.actions;

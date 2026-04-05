import { DesignerMode } from "../../../typings/Core.DynamicDataModel/Enums";
import { LayoutsModel } from "../../../typings/Core.DynamicDataModel/Types";
import { utility } from "didgah/common";
import { DataModelViewModel } from "../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.DataModelViewModel";
import { RelationViewModel } from "../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.RelationViewModel";
import { LayoutType } from "../../../Models/Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.LayoutType";

export interface IInitialLocalState {
    SubLayoutGuid?: string;
    IsSubLayoutConfigeModalVisible?: boolean;
    IsUserAllowedToSelectedSublayoutMode?: boolean;
    IsSubLayoutLoading?: boolean;
    SubLayoutConfige?: {
        SubLayoutType: LayoutType;
        SubLayoutLayout: "New" | string;
    };
    RelationViewModel?: RelationViewModel;
    DefineViewModel?: DataModelViewModel;
    Mode?: DesignerMode;
    SubLayoutsModel?: LayoutsModel;
    RowId?: number;
    GroupGuid?: string;
    ColId?: number;
}

export enum SubLayoutActionType {
    SET_MODAL_VISIBLE = "SET_MODAL_VISIBLE",
    SET_USER_PERMISION = "SET_USER_PERMISION",
    SET_SUBLAYOUT_LOADING = "SET_SUBLAYOUT_LOADING",
    SET_SUBLAYOUT_CONFIGE = "SET_SUBLAYOUT_CONFIGE",
    SET_RELATIONVIEWMODEL = "SET_RELATIONVIEWMODEL",
    SET_SUBLAYOUTSMODEL = "SET_SUBLAYOUTSMODEL",
    SET_WIPE_LAYOUT = "SET_WIPE_LAYOUT",
    SET_DEFINEVIEWMODEL = "SET_DEFINEVIEWMODEL",
    SET_JUSTCLOSMODAL = "SET_JUSTCLOSMODAL",
    SET_DROPPEDROWID = "SET_DROPPEDROWID",
}

export interface Action {
    type: SubLayoutActionType;
    payload: IInitialLocalState;
}

export function SubLayoutRelationReducer(
    state: IInitialLocalState,
    action: Action
): IInitialLocalState {
    switch (action.type as SubLayoutActionType) {
        case SubLayoutActionType.SET_MODAL_VISIBLE:
            return {
                ...state,
                IsSubLayoutConfigeModalVisible:
                    action.payload.IsSubLayoutConfigeModalVisible,
            };

        case SubLayoutActionType.SET_RELATIONVIEWMODEL:
            return {
                ...state,
                RelationViewModel: action.payload.RelationViewModel,
                Mode: action.payload.Mode,

            };

        case SubLayoutActionType.SET_DEFINEVIEWMODEL:
            return {
                ...state,
                RelationViewModel: null,
                Mode: action.payload.Mode,
                IsUserAllowedToSelectedSublayoutMode: action.payload.IsUserAllowedToSelectedSublayoutMode,
                SubLayoutConfige: action.payload.SubLayoutConfige,
                IsSubLayoutConfigeModalVisible: true,
                DefineViewModel: action.payload.DefineViewModel,
            };

        case SubLayoutActionType.SET_USER_PERMISION:
            return {
                ...state,
                IsUserAllowedToSelectedSublayoutMode:
                    action.payload.IsUserAllowedToSelectedSublayoutMode,
            };

        case SubLayoutActionType.SET_SUBLAYOUT_LOADING:
            return {
                ...state,
                IsSubLayoutLoading: action.payload.IsSubLayoutLoading,
            };

        case SubLayoutActionType.SET_SUBLAYOUT_CONFIGE:
            return { ...state, SubLayoutConfige: action.payload.SubLayoutConfige };

        case SubLayoutActionType.SET_WIPE_LAYOUT:
            return {
                SubLayoutGuid: utility.newGuid(),
                Mode: null,
                SubLayoutsModel: null,
                IsSubLayoutConfigeModalVisible: false,
                IsUserAllowedToSelectedSublayoutMode: true,
                IsSubLayoutLoading: true,
                SubLayoutConfige: { SubLayoutType: null, SubLayoutLayout: null },
                RelationViewModel: null,
                RowId: null,
                GroupGuid: null,
                ColId: null,
            };

        case SubLayoutActionType.SET_SUBLAYOUTSMODEL:
            return {
                SubLayoutsModel: action.payload.SubLayoutsModel,
                Mode: DesignerMode.edit,
                IsUserAllowedToSelectedSublayoutMode: false,
                IsSubLayoutConfigeModalVisible: true,
                SubLayoutGuid: action.payload.SubLayoutGuid,
                IsSubLayoutLoading: true,
                SubLayoutConfige: { SubLayoutType: action.payload.SubLayoutConfige.SubLayoutType, SubLayoutLayout: action.payload.SubLayoutConfige.SubLayoutLayout },
                RelationViewModel: null,
                RowId: null,
                GroupGuid: null,
                ColId: null,
            };

        case SubLayoutActionType.SET_JUSTCLOSMODAL:
            return { ...state, IsSubLayoutConfigeModalVisible: false, RelationViewModel: null, };
        case SubLayoutActionType.SET_DROPPEDROWID:
            return { ...state, RowId: action.payload.RowId, GroupGuid: action.payload.GroupGuid, ColId: action.payload.ColId };
        default:
            throw new Error();
    }
}
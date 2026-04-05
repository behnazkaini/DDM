import { ArchiveDesignerTabs, DefineDesignerTabs, DesignerMode, PropertiesDockTabs } from "../../../typings/Core.DynamicDataModel/Enums";
import { LayoutType } from "../../../Models/Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.LayoutType";
import { ArchiveLayoutDesignerViewModel, DefineLayoutDesignerViewModel, IStateStack, LayoutsModel, LayoutViewModelWithState } from "../../../typings/Core.DynamicDataModel/Types";
import { WebSoftwareComponentViewModel } from "../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.WebSoftwareComponentViewModel";

interface IStateHelper {
    getNewFloor: () => IStateStack<LayoutViewModelWithState>;
}

interface StateManagerParams {
    layoutType: LayoutType;
    layoutGuid: string;
    dataModelGuid: string,
    parentLayoutGuid: string,
    mode: DesignerMode,
    layoutModels: LayoutsModel,
    softwareModels: Array<WebSoftwareComponentViewModel>;
}

export const StateManager = function (params: StateManagerParams): IStateHelper {
    let StateHelper: IStateHelper = {
        getNewFloor: () => null,
    }

    const { layoutType } = params;

    switch (layoutType) {
        case LayoutType.Define:
            StateHelper.getNewFloor = () => newDefineFloor(params);
            break;

        case LayoutType.Archive:
            StateHelper.getNewFloor = () => newArchiveFloor(params);
            break;

        case LayoutType.DefineArchive:
            StateHelper.getNewFloor = () => newDefineArchiveFloor(params);
            break;

        case LayoutType.InlineArchive:
            StateHelper.getNewFloor = () => newInlineArchiveFloor(params);
            break;

        default:
            break;
    }

    return StateHelper;
}



const newDefineFloor = (params: StateManagerParams): IStateStack<DefineLayoutDesignerViewModel> => {
    return getStateStackObj(params);
}

const newArchiveFloor = (params: StateManagerParams): IStateStack<ArchiveLayoutDesignerViewModel> => {
    return getStateStackObj(params);
}

const newDefineArchiveFloor = <T>(params: StateManagerParams): IStateStack<T> => {
    return getStateStackObj<T>(params);
}

const newInlineArchiveFloor = <T>(params: StateManagerParams): IStateStack<T> => {
    return getStateStackObj<T>(params);
}

const getStateStackObj = <T>(params: StateManagerParams): IStateStack<T> => {
    const { mode, layoutGuid, dataModelGuid, parentLayoutGuid, layoutModels, layoutType, softwareModels } = params;
    return {
        DataModelGuid: dataModelGuid,
        LayoutGuid: layoutGuid,
        ParentLayoutGuid: parentLayoutGuid,
        LayoutModels: { ...layoutModels },
        Mode: mode,
        LayoutType: layoutType,
        ActiveTab: layoutType !== LayoutType.Define
            ? ArchiveDesignerTabs.Columns
            : DefineDesignerTabs.Container,
        Count: { Group: 0, Row: 0, Field: 0, Column: 0 },
        IsLoading: false,
        StateVersion: 0,
        FormValidation: [],
        PropertiesDockItemState: {
            IsOpen: false,
            LayoutItemFocus: null,
            ActiveSettingTab: PropertiesDockTabs.Setting
        },
        PropertiesDockLayoutState: {
            IsOpen: false,
            ActiveSettingTab: PropertiesDockTabs.Setting,
            LayoutFocus: null,
            IsFormFocused: false
        },
        SoftwareModels: softwareModels,
    }
}
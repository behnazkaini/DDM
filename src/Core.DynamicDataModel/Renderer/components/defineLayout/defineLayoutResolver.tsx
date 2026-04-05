import * as React from "react";
import { translate } from "../../../../Utility/language";
import { LayoutValueByPrimaryKeyResponseViewModel } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.LayoutValueByPrimaryKeyResponseViewModel";

import {
  Button,
  Form,
  FormComponentProps,
  FormLayout,
  Spin,
  useAjax,
} from "didgah/ant-core-component";
import * as Blockly from "blockly";
import {
  RendererLayoutProps,
  EventsAction,
  FormEvents,
  LayoutItemsActions,
  LayoutItemsActionsOnEvent,
  Design,
  GetterSavedDataProps,
  SaveDataViewModel,
} from "../../../../typings/Core.DynamicDataModel/Types";
import { LayoutViewModel } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.LayoutViewModel";
import { WidgetFactory } from "../../../Widget/WidgetFactory";
import SetupData from "./setupDefineLayoutData";
import LayoutManager from "../../../LayoutManager";
import transportLayer from "../../transportLayer";
import { ISetupData } from "../../../../typings/Core.DynamicDataModel/Types";
import ComplexValidator from "../validation/complexValidator";
import { createWorkSpace } from "../../../Designer/components/operationOnEvent/JSBlock/workspace";
import {
  convertBadCharactersToXmlValidCharacter,
  isWorkspaceLayoutItem,
} from "../../../Designer/components/operationOnEvent/JSBlock/helper";
import { LayoutItemType } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.LayoutItemType";
import { LayoutValueByPrimaryKeyRequestViewModel } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.LayoutValueByPrimaryKeyRequestViewModel";
import LayoutContent from "./layoutContent";
import { SaveRowViewModel } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.SaveRowViewModel";
import { RowViewModel } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.RowViewModel";
import { guid } from "didgah/common";
import DefineLayout from "./defineLayout";

const BLOCKLY_DIV_ID = "rendererBlocklyDiv";

interface State {
  initialData: LayoutValueByPrimaryKeyResponseViewModel;
  loading: boolean;
  currentLayout: LayoutViewModel;
  initialDataSetup: ISetupData;
}

interface Action {
  type: string;
  payload: unknown;
}

const initialState: State = {
  initialData: {
    DataModels: undefined,
    Layouts: undefined,
    Row: undefined,
    Variables:undefined
  },
  loading: true,
  currentLayout: null,
  initialDataSetup: null,
};

type RenderInParentComp = {
  hasParent?: true;
  parentInitialData?: any;
};

type RenderWithoutParent = {
  hasParent?: false;
  parentInitialData?: never;
};
// interface DefineLayoutWithOnGetSavedData extends Omit<RendererLayoutProps, 'onGetSavedData'> {
//   onGetSavedData: number
// }

type DefineLayoutProps = (RenderInParentComp | RenderWithoutParent) &
  RendererLayoutProps<LayoutValueByPrimaryKeyResponseViewModel> &
  FormComponentProps;

function defineLayoutResolver(props: DefineLayoutProps) {
  return <DefineLayout {...props} />
}

export default Form.create({})(defineLayoutResolver);

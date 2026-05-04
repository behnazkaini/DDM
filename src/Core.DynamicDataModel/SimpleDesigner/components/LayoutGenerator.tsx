import { LayoutType } from "../../../Models/Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.LayoutType";
import React from "react";
import LayoutManager from "../../LayoutManager";
import useFloorStack from "../hooks/useFloorStack";
import {
  SimpleDesignerGlobalPropsContext,
  SetFormSetting,
} from "../store/reducers/designLayoutSlice";
import { DesignerMode } from "../../../typings/Core.DynamicDataModel/Enums";
import { Checkbox, DidgahContextProps, Form, Input, Modal, StackPanel } from "didgah/ant-core-component";
import { RelationViewModel } from "../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.RelationViewModel";
import { ColumnViewModel } from "../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.ColumnViewModel";
import { translate } from "didgah/common";
import { useAppDispatch } from "../store/hook";
import {
  ICLoseProps,
  SimpleDesignerIStateStack,
  LayoutDesignerPermission,
  SimpleDesignerICLoseProps,
  SimpleDesignerLayoutViewModelWithState,
} from "../../../typings/Core.DynamicDataModel/Types";
import { DDMPlugin } from "@didgah/ddm-plugins";
const FormRow = Form.Row;
const FormItem = Form.Item;

const LayoutGenerator = (props: {
  mode: DesignerMode;
  layoutGuid: string;
  layoutType: LayoutType;
  dataViewModel?: RelationViewModel | ColumnViewModel;
  parentGuid: string;
  onCloseWindows?: (props: SimpleDesignerICLoseProps) => void;
  onSaveForm?: (floor?: SimpleDesignerIStateStack<SimpleDesignerLayoutViewModelWithState>) => void;
  onOpenFormSetting?: (state: boolean) => void;
  Master: boolean;
  permission: LayoutDesignerPermission;
  context: DidgahContextProps;
  plugins?: DDMPlugin[];
  copyFormAppFn?: Function;
  scopeGuid: string;
  softwareGuid: string;
}) => {
  const {
    layoutGuid,
    mode,
    layoutType,
    onCloseWindows,
    dataViewModel,
    parentGuid,
    onSaveForm,
    Master,
    permission,
    context,
    copyFormAppFn,
    plugins,
    scopeGuid,
    softwareGuid
  } = props;
  SimpleDesignerGlobalPropsContext.displayName = layoutGuid;
  const { currentFloor, currentLayout } = useFloorStack({ layoutGuid });
  const layoutManager = new LayoutManager({
    LayoutsModel: {
      DataModels: currentFloor.LayoutModels.DataModels,
      Layouts: currentFloor.LayoutModels.Layouts,
    },
    context,
    isSimpleDesignerMode: true
  });

  const [formSettingModalVisible, setFormSettingModalVisible] =
    React.useState(false);
  const [formName, setFormNameValue] = React.useState(currentLayout.Label);
  const [isDefaul, setIsDefaulValue] = React.useState(currentLayout.IsDefault);

  const FormNameOnChange = (e) => {
    setFormNameValue(e.target.value);
  };

  const InDefaultOnChange = (e) => {
    setIsDefaulValue(e.target.checked);
  };



  const closeWindowsHandler = (props: ICLoseProps) => {
    if (onCloseWindows == null) {
      return;
    }
    onCloseWindows({ subfloor: { ...currentFloor }, rapidClose: props.rapidClose }); 
  };

  const saveFormDesingnerHandler = () => {
    if (onSaveForm == null) {
      return;
    }

    if (Master) {
      onSaveForm({ ...currentFloor });
    } else {
      onSaveForm({ ...currentFloor });
    }
  };

  const DesignerComponent = layoutManager.getDesigner({
    dataModels: currentFloor.LayoutModels.DataModels,
    layouts: currentFloor.LayoutModels.Layouts,
    currentLayoutGuid: layoutGuid,
  });

  return (
    <SimpleDesignerGlobalPropsContext.Provider
      value={{
        layoutGuid,
        mode,
        layoutType,
        closeWindow: closeWindowsHandler,
        dataViewModel,
        parentGuid,
        onSaveForm: saveFormDesingnerHandler,
        openFormSettingModal: setFormSettingModalVisible,
        permission: { ...permission },
        copyFormAppFn,
        plugins,
        context,
        scopeGuid,
        softwareGuid
      }}
    >
      <DesignerComponent key={`ُSimpleDesigner_${layoutGuid}`} />
   
    </SimpleDesignerGlobalPropsContext.Provider>
  );
};

export default LayoutGenerator;

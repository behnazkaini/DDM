import { LayoutType } from "../../../Models/Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.LayoutType";
import React, { useState } from "react";
import LayoutManager from "../../LayoutManager";
import useFloorStack from "../hooks/useFloorStack";
import {
  GlobalPropsContext,
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
  IStateStack,
  LayoutDesignerPermission,
  LayoutViewModelWithState,
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
  onCloseWindows?: (props: ICLoseProps) => void;
  onSaveForm?: (floor?: IStateStack<LayoutViewModelWithState>) => void;
  onOpenFormSetting?: (state: boolean) => void;
  Master: boolean;
  permission: LayoutDesignerPermission;
  context: DidgahContextProps;
  plugins?: DDMPlugin[];
  copyFormAppFn?: Function;
}) => {
  const dispatch = useAppDispatch();
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
    plugins
  } = props;
  GlobalPropsContext.displayName = layoutGuid;
  const { currentFloor, currentLayout } = useFloorStack({ layoutGuid });
  const layoutManager = new LayoutManager({
    LayoutsModel: {
      DataModels: currentFloor.LayoutModels.DataModels,
      Layouts: currentFloor.LayoutModels.Layouts,
    },
    context,
    isSimpleDesignerMode: false
  });

  const [formSettingModalVisible, setFormSettingModalVisible] =
    React.useState(false);
  const [formName, setFormNameValue] = React.useState(currentLayout.Label);
  const [isDefaul, setIsDefaulValue] = React.useState(currentLayout.IsDefault);
  const [showFormItemLabelInSepratedRow, setShowFormItemLabelInSepratedRow] = useState(currentLayout.ShowFormItemLabelInSepratedRow);




  const FormNameOnChange = (e) => {
    setFormNameValue(e.target.value);
  };


  const InDefaultOnChange = (e) => {
    setIsDefaulValue(e.target.checked);
  };

  const ShowFormItemLabelInSepratedRowChange = (e) => {
    setShowFormItemLabelInSepratedRow(e.target.checked);
  };

  const formSettingSaveHandler = () => {
    dispatch(
      SetFormSetting({
        LayoutGuid: layoutGuid,
        formName: formName,
        formIsDefault: isDefaul,
        showFormItemLabelInSepratedRow: showFormItemLabelInSepratedRow
      })
    );
    setFormSettingModalVisible(false);
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
    <GlobalPropsContext.Provider
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
      }}
    >
      <DesignerComponent key={`Designer_${layoutGuid}`} />
      <Modal
        visible={formSettingModalVisible}
        onOk={formSettingSaveHandler}
        onCancel={() => setFormSettingModalVisible(false)}
        title={`${translate("Settings")} ${translate("Form")}`}
      >
        <StackPanel widthRatio={1} verticalMode={true}>
          <FormRow>
            <FormItem
              label={`${translate("Name")} ${translate("Form")}`}
              labelCol={{ span: 3, offset: 0 }}
              wrapperCol={{ span: 21, offset: 0 }}
            >
              <Input
                type="text"
                value={formName}
                onChange={FormNameOnChange}
              ></Input>
            </FormItem>
          </FormRow>
          <FormRow>
            <FormItem
              labelCol={{ span: 15, offset: 0 }}
              wrapperCol={{ span: 9, offset: 0 }}
              label={translate("ShowFormItemLabelInSepratedRow")}
            >
              <Checkbox
                onChange={ShowFormItemLabelInSepratedRowChange}
                defaultChecked={showFormItemLabelInSepratedRow}
              ></Checkbox>
            </FormItem>
            {Master && (
              <FormItem
                labelCol={{ span: 8, offset: 0 }}
                wrapperCol={{ span: 16, offset: 0 }}
                label={`${translate("Form")} ${translate("Default")}`}
              >
                <Checkbox
                  onChange={InDefaultOnChange}
                  defaultChecked={isDefaul}
                ></Checkbox>
              </FormItem>
            )}
          </FormRow>
        </StackPanel>
      </Modal>
    </GlobalPropsContext.Provider>
  );
};

export default LayoutGenerator;

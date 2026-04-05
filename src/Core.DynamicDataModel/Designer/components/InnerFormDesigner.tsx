import { DesignerMode } from "../../../typings/Core.DynamicDataModel/Enums";
import { translate, utility } from "didgah/common";
import { LayoutItemType } from "../../../Models/Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.LayoutItemType";
import { LayoutType } from "../../../Models/Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.LayoutType";
import * as React from "react";
import {
  AddSelectedSubLayoutColumnActionPayload,
  AddSubLayoutArchiveDefineActionPayload,
  AddSubLayoutColumnActionPayload,
  FormValidationError,
  ICLoseProps,
  IStateStack,
  LayoutDesignerPermission,
  LayoutViewModelWithState,
} from "../../../typings/Core.DynamicDataModel/Types";
import { useAppDispatch } from "../store/hook";
import {
  AddSubLayoutArchiveDefineAction,
  AddNewSubLayoutColumnAction,
  GlobalPropsContext,
  PushLayoutModelAction,
  UpdateSubLayout,
  ValidateFormAsyncAction,
  WipeLayout,
  AddColumnAction,
  AddSelectedSubLayoutColumnAction,
} from "../store/reducers/designLayoutSlice";

import LayoutGenerator from "./LayoutGenerator";
import { Action } from "./LayoutDesignerPane";
import { Modal } from "didgah/ant-core-component";
import {
  IInitialLocalState,
  SubLayoutActionType,
} from "../store/localLayoutContext";
import { StateManager } from "../services/StateManager";
import { WebSoftwareComponentViewModel } from "../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.WebSoftwareComponentViewModel";
import { DDMPlugin } from "@didgah/ddm-plugins";
import LayoutMapper from "../services/mapper/LayoutMapper";

interface IInnerFormDesigner {
  subLayoutState: IInitialLocalState;
  subLayoutDispatch: React.Dispatch<Action>;
  permission: LayoutDesignerPermission;
  softwareModels: Array<WebSoftwareComponentViewModel>;
  plugins?: DDMPlugin[];
  parentLayoutType: LayoutType;
}

const InnerFormDesigner = (props: IInnerFormDesigner) => {
    const { subLayoutState, subLayoutDispatch, permission, softwareModels, plugins, parentLayoutType } = props;
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

  const dispatch = useAppDispatch();
  const {
    layoutGuid,
    layoutType,
    closeWindow,
    dataViewModel,
    onSaveForm,
    parentGuid,
    openFormSettingModal,
    context,
  } = React.useContext(GlobalPropsContext);

  //inner save --- START
  const saveForm = (subfloor: IStateStack<LayoutViewModelWithState>) => {
    const subLayout = subfloor.LayoutModels.Layouts.find(
      (layout) => layout.Guid.toLowerCase() === SubLayoutGuid.toLowerCase()
    );

    subLayoutDispatch({
      type: SubLayoutActionType.SET_SUBLAYOUT_LOADING,
      payload: { IsSubLayoutLoading: true },
    });

    dispatch(ValidateFormAsyncAction(subLayout)).then((feedback) => {
      if ((feedback.payload["Errors"] as FormValidationError[]).length === 0) {
        if (SubLayoutConfige.SubLayoutType === LayoutType.Define) {
          if(parentLayoutType === LayoutType.Define) {
            saveDefineToDefine(subfloor.LayoutModels.Layouts);
          } else {
            saveDefineToArchiveDefine();
          }
        } else {
          SaveLayoutArchiveProccess();
        }

        dispatch(WipeLayout({ LayoutGuid: SubLayoutGuid }));
        subLayoutDispatch({
          type: SubLayoutActionType.SET_WIPE_LAYOUT,
          payload: null,
        });
      } else {
        subLayoutDispatch({
          type: SubLayoutActionType.SET_SUBLAYOUT_LOADING,
          payload: { IsSubLayoutLoading: false },
        });
      }
    });
  };

  //inner close --- START
  const closeForm = (props: ICLoseProps) => {
    const { subfloor, rapidClose = false } = props;
    cancelArchiveDesignerHandler({ subfloor, rapidClose });
  };

  // Layout Archive --START
  const saveToStoreProccess = () => {
    //SubLayout Column
    const NewSubLayoutColumnContainer: AddSubLayoutColumnActionPayload = {
      LayoutGuid: layoutGuid,
      ItemType: LayoutItemType.SubLayout,
      Design: null,
      RelationGuid: RelationViewModel.Guid,
      SubLayoutGuid: SubLayoutGuid,
      RowId: RowId,
      LayoutType: LayoutType.Archive,
      GroupGuid,
      ColId,
    };

    dispatch(
      AddNewSubLayoutColumnAction({
        ...NewSubLayoutColumnContainer,
      } as AddSubLayoutColumnActionPayload)
    );
  };

  const SaveLayoutArchiveProccess = () => {
    if (Mode === DesignerMode.add) {
      saveToStoreProccess();
    } else if (Mode === DesignerMode.edit) {
      dispatch(
        UpdateSubLayout({
          LayoutGuid: SubLayoutGuid,
          ParentLayoutGuid: layoutGuid,
        })
      );
    }
  };

  const cancelArchiveDesignerHandler = (props: ICLoseProps) => {
    const { subfloor, rapidClose } = props;
    const subLayout = subfloor.LayoutModels.Layouts.find(
      (layout) => layout.Guid.toLowerCase() === SubLayoutGuid.toLowerCase()
    );

    const onConfirmCancel = () => {
      subLayoutDispatch({
        type: SubLayoutActionType.SET_WIPE_LAYOUT,
        payload: null,
      });
      dispatch(WipeLayout({ LayoutGuid: SubLayoutGuid }));
    };

    const onCancel = () => {
      return;
    };

    if (
      (subLayout.State === "Added" && subLayout.Items.length === 0) ||
      rapidClose
    ) {
      onConfirmCancel();
    } else {
      Modal.confirm({
        title: translate("DDMCancelModalConfirmTitle"),
        content: translate("DDMCancelModalConfirmDesc"),
        okText: translate("Ok"),
        cancelText: translate("Cancel"),
        onOk: onConfirmCancel,
        onCancel: onCancel,
      });
    }
  };
  // Layout Archive --END

  // Layout InnerDefine --START

  const saveDefineToArchiveDefine = () => {
    if (Mode === DesignerMode.add) {
      //SubLayout Column
      const NewSubLayoutColumnContainer: AddSubLayoutArchiveDefineActionPayload =
        {
          LayoutGuid: layoutGuid,
          ItemType: LayoutItemType.SubLayout,
          SubLayoutGuid: SubLayoutGuid,
          LayoutType: LayoutType.DefineArchive,
        };

      dispatch(
        AddSubLayoutArchiveDefineAction({
          ...NewSubLayoutColumnContainer,
        } as AddSubLayoutArchiveDefineActionPayload)
      );
    } else if (Mode === DesignerMode.edit) {
      dispatch(
        UpdateSubLayout({
          LayoutGuid: SubLayoutGuid,
          ParentLayoutGuid: layoutGuid,
        })
      );
    }
  }

  const saveDefineToDefine = (layouts: any) => {
  const layoutMapper = new LayoutMapper();
    if (Mode === DesignerMode.add) {
      //SubLayout Column
    
      const SelectedubLayoutColumnContainer: AddSelectedSubLayoutColumnActionPayload =
        {
          LayoutGuid: layoutGuid,
          ItemType: LayoutItemType.SubLayout,
          Design: null,
          RelationGuid: RelationViewModel.Guid,
          SubLayoutGuid: layouts[0].Guid,
          RowId: RowId,
          LayoutType: SubLayoutConfige.SubLayoutType,
          Layouts: layoutMapper.toDesignerViewModels(layouts).map(layout => {layout.State = 'Added'; return layout;}),
          GroupGuid,
          ColId,
        };

        dispatch(
          AddSelectedSubLayoutColumnAction({
            ...SelectedubLayoutColumnContainer,
          } as AddSelectedSubLayoutColumnActionPayload)
        );
    } else if (Mode === DesignerMode.edit) {
      dispatch(
        UpdateSubLayout({
          LayoutGuid: SubLayoutGuid,
          ParentLayoutGuid: layoutGuid,
        })
      );
    }

    dispatch(WipeLayout({ LayoutGuid: SubLayoutGuid }));
    subLayoutDispatch({
      type: SubLayoutActionType.SET_WIPE_LAYOUT,
      payload: null,
    });
  };
  // Layout InnerDefine --END

  const subLayoutPermission = (): LayoutDesignerPermission => {
    if (!permission.readOnly) {
      return { readOnly: false };
   
    }

    return { readOnly: permission.readOnly };
  };

  React.useEffect(() => {
    if (Mode === DesignerMode.edit) {
      const stateManager = StateManager({
        parentLayoutGuid: layoutGuid,
        layoutGuid: SubLayoutGuid,
        mode: DesignerMode.edit,
        layoutType: SubLayoutConfige.SubLayoutType,
        layoutModels: SubLayoutsModel,
        dataModelGuid: SubLayoutsModel.Layouts.find(
          (layout) => layout.Guid.toLowerCase() === SubLayoutGuid.toLowerCase()
        ).DataModelGuid,
        softwareModels: softwareModels
      });

      dispatch(PushLayoutModelAction(stateManager.getNewFloor()));
      subLayoutDispatch({
        type: SubLayoutActionType.SET_SUBLAYOUT_LOADING,
        payload: { IsSubLayoutLoading: false },
      });
    }
  }, []);

  const subLayoutDesignerPermission = subLayoutPermission();

  return (
    <>
      <Modal
        title={null}
        visible={IsSubLayoutConfigeModalVisible}
        onOk={null}
        onCancel={() => closeWindow({ rapidClose: permission.readOnly })}
        footer={null}
        width={"90%"}
        closable={false}
        bodyStyle={{ minHeight: 600 }}
        maskClosable={false}
        key={`ModalInnerDesigner_${SubLayoutGuid}`}
      >
        <div style={{ height: "550px" }}>
          {!IsSubLayoutLoading && (
            <LayoutGenerator
              key={`LayoutGenerator_${SubLayoutGuid}`}
              mode={Mode}
              layoutGuid={SubLayoutGuid}
              layoutType={SubLayoutConfige.SubLayoutType}
              onCloseWindows={closeForm}
              onSaveForm={saveForm}
              dataViewModel={RelationViewModel}
              parentGuid={layoutGuid}
              onOpenFormSetting={openFormSettingModal}
              Master={false}
              permission={subLayoutDesignerPermission}
              context={context}
              plugins={plugins}
            />
          )}
        </div>
      </Modal>
    </>
  );
};

export default InnerFormDesigner;

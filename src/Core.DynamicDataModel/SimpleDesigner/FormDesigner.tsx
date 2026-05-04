import * as React from "react";
import LayoutGenerator from "./components/LayoutGenerator";
import {
  FormValidationError,
  SimpleDesignerIStateStack,
  LayoutDesignerCommandHandlerParameter,
  SimpleDesignerLayoutViewModelWithState,
} from "../../typings/Core.DynamicDataModel/Types";
import { useAppDispatch } from "./store/hook";
import {
  ChangeLoadingState,
  PushLayoutModelAction,
  SimpleDesignerGlobalPropsContext,
  ValidateFormAsyncAction,
  openPropertiesDockAction,
} from "./store/reducers/designLayoutSlice";
import DDM_API from "./services/APIs";
import {
  DidgahContextProps,
  injectContext,
  Message,
  useAjax,
} from "didgah/ant-core-component";
import LayoutMapper from "./services/mapper/LayoutMapper";
import { guid, translate } from "didgah/common";
import LayoutManager, { importSoftwareModelComponents } from "./../LayoutManager";
import { StateManager } from "./services/StateManager";
import { DesignerMode, ErrorDesignType } from "../../typings/Core.DynamicDataModel/Enums";
import { DDMPlugin } from "@didgah/ddm-plugins";

import { importModule, softwareGuid } from "../../Utility/helpers";
import { loadSoftwaresPrerequisiteResources } from "./helper";
import { userSetting } from "didgah/common";
import { SaveSimpleChangesViewModel } from "../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.Simple.SaveSimpleChangesViewModel";
import { current } from "@reduxjs/toolkit";

interface FormDesignerProps extends LayoutDesignerCommandHandlerParameter {
  context?: DidgahContextProps;
  scopeGuid: string;
}

const FormDesigner = (props: FormDesignerProps) => {
  const API = new DDM_API({ ajax: useAjax() });
  const [isLoading, setIsloading] = React.useState<boolean>(true);
  const {
    mode,
    layoutGuid,
    dataModelGuid,
    layoutType,
    parentGuid,
    context,
    permission = { write: true, read: true },
    plugins,
    scopeGuid,
    copyFormAppFn = null,
    softwareGuid
  } = props;
  const dispatch = useAppDispatch();
  const ajax = useAjax();
  const [predefinedDataModelGuids, setPredefinedDataModelGuids] = React.useState([]);

  const init = async () => {
    try {
      await loadSoftwaresPrerequisiteResources(ajax);
      const softwareModelsResult = await API.GetWebSoftwareComponents();
      await importSoftwareModelComponents({
        softwareModels: softwareModelsResult,
        context,
      })
      if (mode == DesignerMode.add) {
        let dataModelsResult;
        try {
          dataModelsResult = dataModelGuid ? await API.GetDataModelByGuid({
            Guid: dataModelGuid,
          }) : [];
        } catch (e) {
          dataModelsResult = [];
        }
        const dataModel = dataModelsResult.find(d => d.Guid === dataModelGuid);
        setPredefinedDataModelGuids(dataModelsResult.map(d => d.Guid));
        const layoutManager = new LayoutManager({
          LayoutsModel: { Layouts: [], DataModels: [...dataModelsResult] },
          context,
          isSimpleDesignerMode: true
        });
        const currentDataModelGuid = dataModelGuid ? dataModelGuid : guid.newGuid();
        const newLayout = layoutManager.getNewLayout({
          dataModelGuid: currentDataModelGuid,
          relationViewModel: null,
          newLayoutGuid: layoutGuid,
          layoutType: layoutType,
          dataModelsResult: dataModel
        });
        (newLayout as SimpleDesignerLayoutViewModelWithState).SimpleDesignerDataModelState = dataModelsResult.length > 0 ? 'Unchanged' : 'Added';
        (newLayout as SimpleDesignerLayoutViewModelWithState).SimpleDesignerLayoutState = 'Added';
        const stateManager = StateManager({
          layoutGuid,
          dataModelGuid: currentDataModelGuid,
          parentLayoutGuid: parentGuid,
          mode,
          layoutType,
          layoutModels: {
            DataModels: dataModelsResult,
            Layouts: [newLayout],
          },
          softwareModels: softwareModelsResult,
        });

        dispatch(PushLayoutModelAction(stateManager.getNewFloor()));
        setIsloading(false);

      } else if (mode == DesignerMode.edit) {
        const dataModelsResult = await API.GetLayoutByGuid({
          Guid: layoutGuid,
        });

        const layoutMapper = new LayoutMapper({
          dataModelGuid: dataModelGuid,
          dataModels: dataModelsResult.DataModels,
          softwareGuid,
          scopeGuid
        });

        const stateManager = StateManager({
          layoutGuid,
          dataModelGuid,
          parentLayoutGuid: parentGuid,
          mode,
          layoutType,
          layoutModels: {
            DataModels: dataModelsResult.DataModels,
            Layouts: layoutMapper.toDesignerViewModels(
              dataModelsResult.Layouts
            ),
          },
          softwareModels: softwareModelsResult,
        });
        dispatch(PushLayoutModelAction(stateManager.getNewFloor()));
        setIsloading(false);
      }
    } catch (e) {
      console.log(e);
      Message.error(translate("DDMLoadingDesignerError"));
    }
  }

  React.useEffect(() => {
    init();
  }, []);

  return !isLoading
    ? WrapperFormDesigner({ isLoading, commandHandlerProps: props, plugins, scopeGuid, predefinedDataModelGuids, softwareGuid })
    : null;
};

const WrapperFormDesigner = (props: {
  isLoading: boolean;
  commandHandlerProps: FormDesignerProps;
  plugins?: DDMPlugin[];
  scopeGuid: string;
  predefinedDataModelGuids?: string[];
  softwareGuid: string;
}) => {
  const dispatch = useAppDispatch();
  const API = new DDM_API({ ajax: useAjax() });
  const { commandHandlerProps, isLoading, plugins = [], scopeGuid, softwareGuid } = props;
  const {
    mode,
    layoutGuid,
    dataModelGuid,
    layoutType,
    parentGuid,
    context,
    permission = { readOnly: false },
    copyFormAppFn
  } = commandHandlerProps;


  function onSaveForm(currentFloor?: SimpleDesignerIStateStack<SimpleDesignerLayoutViewModelWithState>) {
    const currentLayout = {
      ...currentFloor.LayoutModels.Layouts.find(
        (layout) => layout.Guid.toLowerCase() === layoutGuid.toLowerCase()
      ),
    };
    const { FormValidation } = currentFloor;
    dispatch(ValidateFormAsyncAction(currentLayout)).then((feedback) => {
      if ((feedback.payload["Errors"] as FormValidationError[]).length === 0) {
        if (FormValidation.length === 0) {
          const layoutMapper = new LayoutMapper({
            softwareGuid,
            scopeGuid
          });
          const layoutChanges = layoutMapper.toSaveViewModel(
            currentFloor.LayoutModels.Layouts,
            props.predefinedDataModelGuids
          );
          const dataModelChanges = layoutMapper.toDataModelSaveViewModel(
            currentFloor.LayoutModels.Layouts,
            dataModelGuid
          );
          const dataSent: SaveSimpleChangesViewModel = {
            SaveLayoutChanges: layoutChanges,
            SaveDataModelChanges: dataModelChanges
          };
          dispatch(
            ChangeLoadingState({
              LayoutGuid: currentLayout.Guid,
              IsLoading: true,
            })
          );
          API.SimpleDesignerSaveLayout(dataSent)
            .done((result) => {
              Message.success(translate("DDMSavingDesignerSuccess"));
              context.commandHandler.closeWindow(true);
            })
            .fail((errors) => {
              Message.error(translate("DDMSavingDesignerError"));
              dispatch(
                ChangeLoadingState({
                  LayoutGuid: currentLayout.Guid,
                  IsLoading: true,
                })
              );
              console.error(errors);
            });
        } else {
          Message.error(translate("DDMFormIsInvalid"));
        }
      } else {
        const hasFormError = feedback.payload["Errors"].find(error => error.ErrorType === ErrorDesignType.WrongFormInfo);
        if (hasFormError) {
          openFormSetting();
        }
      }
    });
  }

  const openFormSetting = () => {
    dispatch(
      openPropertiesDockAction({
        LayoutGuid: layoutGuid,
      })
    );
  };

  const CloseWindowsHandler = () => {
    context.commandHandler.closeWindow();
  };

  return !isLoading ? (
    <LayoutGenerator
      key={layoutGuid}
      mode={mode}
      layoutGuid={layoutGuid}
      layoutType={layoutType}
      parentGuid={parentGuid}
      onSaveForm={onSaveForm}
      onCloseWindows={CloseWindowsHandler}
      Master={true}
      permission={permission}
      context={context}
      plugins={plugins}
      copyFormAppFn={copyFormAppFn}
      scopeGuid={scopeGuid}
      softwareGuid={softwareGuid}
    />
  ) : null;
};

export default injectContext(FormDesigner);

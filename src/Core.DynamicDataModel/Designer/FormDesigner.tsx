import * as React from "react";
import LayoutGenerator from "./components/LayoutGenerator";
import {
  FormValidationError,
  IStateStack,
  LayoutDesignerCommandHandlerParameter,
  LayoutViewModelWithState,
} from "../../typings/Core.DynamicDataModel/Types";
import { useAppDispatch } from "./store/hook";
import {
  ChangeLoadingState,
  PushLayoutModelAction,
  ValidateFormAsyncAction,
} from "./store/reducers/designLayoutSlice";
import DDM_API from "./services/APIs";
import {
  DidgahContextProps,
  injectContext,
  Message,
  useAjax,
} from "didgah/ant-core-component";
import LayoutMapper from "./services/mapper/LayoutMapper";
import { translate } from "didgah/common";
import LayoutManager, { importSoftwareModelComponents } from "./../LayoutManager";
import { StateManager } from "./services/StateManager";
import { DesignerMode } from "../../typings/Core.DynamicDataModel/Enums";
import { DDMPlugin } from "@didgah/ddm-plugins";
import { loadSoftwaresPrerequisiteResources } from "./helper";
import { SaveDataModelVariableViewModel } from "../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.DataModel.SaveDataModelVariableViewModel";

interface FormDesignerProps extends LayoutDesignerCommandHandlerParameter {
  context?: DidgahContextProps;
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
    copyFormAppFn = null
  } = props;
  const dispatch = useAppDispatch();
  const ajax = useAjax();

  const init = () => {
    loadSoftwaresPrerequisiteResources(ajax).then(() => {
      const GetWebSoftwareComponents = API.GetWebSoftwareComponents();
      if (mode == DesignerMode.add) {
        const GetDataModelByGuidPromise = API.GetDataModelByGuid({
          Guid: dataModelGuid,
        });

        Promise.all([GetDataModelByGuidPromise, GetWebSoftwareComponents])
          .then((results) => {
            const [dataModelsResult, softwareModelsResult] = results;

            Promise.all(
              importSoftwareModelComponents({
                softwareModels: softwareModelsResult,
                context,
              })
            ).then(() => {
              const layoutManager = new LayoutManager({
                LayoutsModel: { Layouts: [], DataModels: [...dataModelsResult] },
                context,
                isSimpleDesignerMode: false
              });

              const newLayout = layoutManager.getNewLayout({
                dataModelGuid: dataModelGuid,
                relationViewModel: null,
                newLayoutGuid: layoutGuid,
                layoutType: layoutType,
              });

              const stateManager = StateManager({
                layoutGuid,
                dataModelGuid,
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
            });
          })
          .catch(() => {
            Message.error(translate("DDMLoadingDesignerError"));
          });
      } else if (mode == DesignerMode.edit) {
        const GetLayoutByGuidPromise = API.GetLayoutByGuid({
          Guid: layoutGuid,
        });

        Promise.all([GetLayoutByGuidPromise, GetWebSoftwareComponents])
          .then((results) => {
            const [dataModelsResult, softwareModelsResult] = results;
            const layoutMapper = new LayoutMapper();

            Promise.all(
              importSoftwareModelComponents({
                softwareModels: softwareModelsResult,
                context,
              })
            ).then(() => {
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
            });
          })
          .catch(() => {
            Message.error(translate("DDMLoadingDesignerError"));
          });
      }
    }).catch((e) => {
      console.log(e);
    });
  }

  React.useEffect(() => {
    init();
  }, []);

  return !isLoading
    ? WrapperFormDesigner({ isLoading, commandHandlerProps: props, plugins })
    : null;
};

const WrapperFormDesigner = (props: {
  isLoading: boolean;
  commandHandlerProps: FormDesignerProps;
  plugins?: DDMPlugin[];
}) => {
  const dispatch = useAppDispatch();
  const API = new DDM_API({ ajax: useAjax() });

  const { commandHandlerProps, isLoading, plugins = [] } = props;
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

  function onSaveForm(currentFloor?: IStateStack<LayoutViewModelWithState>) {
    const currentLayout = {
      ...currentFloor.LayoutModels.Layouts.find(
        (layout) => layout.Guid.toLowerCase() === layoutGuid.toLowerCase()
      ),
    };
    const { FormValidation } = currentFloor;
    dispatch(ValidateFormAsyncAction(currentLayout)).then((feedback) => {
      if ((feedback.payload["Errors"] as FormValidationError[]).length === 0) {
        if (FormValidation.length === 0) {
          const layoutMapper = new LayoutMapper();
          const apiRequest = layoutMapper.toSaveViewModel(
            currentFloor.LayoutModels.Layouts
          );
          dispatch(
            ChangeLoadingState({
              LayoutGuid: currentLayout.Guid,
              IsLoading: true,
            })
          );

          const save = async () => {
            try {
              const promises = [API.SaveLayout(apiRequest)]
              const layoutsWithVariables = currentFloor.LayoutModels.Layouts.flatMap(layout => layout?.Variables);
              if (layoutsWithVariables.length > 0) {
                const variables: SaveDataModelVariableViewModel = {
                  Added: [],
                  Deleted: []
                }
                layoutsWithVariables.forEach(v => {
                  if (v?.Added && v.Added?.length > 0) variables.Added.push(...v.Added)
                  if (v?.Deleted && v.Deleted?.length > 0) variables.Deleted.push(...v.Deleted)
                })
                promises.push(API.SaveVariables(variables))
              }

              await Promise.all(promises);
              Message.success(translate("DDMSavingDesignerSuccess"));
              context.commandHandler.closeWindow(true);
            } catch (errors) {
              Message.error(translate("DDMSavingDesignerError"));
              dispatch(
                ChangeLoadingState({
                  LayoutGuid: currentLayout.Guid,
                  IsLoading: true,
                })
              );
              console.error(errors);
            }
          }

          save();
        } else {
          Message.error(translate("DDMFormIsInvalid"));
        }
      }
    });
  }

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
    />
  ) : null;
};

export default injectContext(FormDesigner);

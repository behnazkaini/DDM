import * as React from "react";
import {
  Button,
  FormLayout,
  injectContext,
  Spin,
  useAjax,
} from "didgah/ant-core-component";

import { RendererCommandHandlerProps } from "../../typings/Core.DynamicDataModel/Types";
import transportLayer from "./transportLayer";
import { LayoutBriefViewModel } from "../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.LayoutBriefViewModel";
import { WebSoftwareComponentViewModel } from "../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.WebSoftwareComponentViewModel";
import WrapperLayouts from "./components/wrapperLayouts";
import { importSoftwareModelComponents } from "../LayoutManager";
import { WidgetType } from "../../typings/Core.DynamicDataModel/Enums";
import modelerTransportLayer from '../Modeler/transportLayer';
import { DataModelViewModel } from "../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.DataModelViewModel";
import { getApiUrl, loadJsResourcesSync } from "../../Utility/helpers";

//const primaryKeyy = 'c3a6cc00-4100-5541-eb87-6c502efaf4dc', LayoutGuid = 'c6fa83bf-a4d5-6eac-edb7-49ffc6c4a201';

//const primaryKeyy = 'f0a191ef-ec23-b46a-6817-03adbe44443b', LayoutGuid = '46acc0d9-13ee-cf0e-3f45-1a698135abeb';//define-sub-only
//const primaryKeyy = 'f2b0f34c-03c3-ae22-fcdc-1e8796e98880', LayoutGuid = '864ea85f-597a-fd05-ec8d-ef1702d4b4d3';//inline-archive-sub
const primaryKeyy = undefined, LayoutGuid = undefined



const layoutMode = "add";

function FormRenderer({
  primaryKey = primaryKeyy,
  layoutGuid = LayoutGuid,
  mode = layoutMode,
  inLoadableMode = false,
  store,
  context,
  widgetsMode,
  initialFormData,
  previewInitialDataForDesigner,
  dataModelGuid,
  remoteDataSource,
  softwareGuid
}: RendererCommandHandlerProps & { store: any }) {
  const ajax = useAjax();
  const [loading, setLoading] = React.useState<boolean>(true);
  const layoutBriefData = React.useRef<LayoutBriefViewModel>(null);
  const webSoftwareComponents = React.useRef<WebSoftwareComponentViewModel[]>(
    []
  );
  const getterLayoutsSavedData = React.useRef([]);
  const formApiRef = React.useRef(null);

  function loadSoftwaresPrerequisiteResources(ajax) {
    return new Promise<void>((res, rej) => {
      ajax.post(getApiUrl('DynamicDataModel', 'Layout', 'GetPrerequisiteResources'), {}).then((result) => {
        if (result.length > 0) {
          loadJsResourcesSync({
            resources: result, index: 0, render: true, onComplete: () => {
              res();
            }
          })
        } else res();
      }).catch(() => {
        rej();
      });
    })
  }

  React.useEffect(() => {
    const prevScripts = document.querySelectorAll("script[id^=operationOnEvents]");
    prevScripts?.forEach(script => script.remove());
    loadSoftwaresPrerequisiteResources(ajax).then(() => {
      if (!previewInitialDataForDesigner) {
        transportLayer(ajax)
          .GetLayoutBriefByGuid({ Guid: layoutGuid })
          .then((result) => {
            transportLayer(ajax)
              .GetWebSoftwareComponents()
              .then((webSoftwareComponentsResult) => {
                webSoftwareComponents.current = webSoftwareComponentsResult
                //Register softwareModel components on global scope
                Promise.all(
                  importSoftwareModelComponents({
                    softwareModels: webSoftwareComponents.current,
                    context,
                  })
                ).then(() => {
                  layoutBriefData.current = result;
                  webSoftwareComponents.current = webSoftwareComponentsResult;
                  setLoading(false);
                });
              });
          })
          .fail((error) => {
            console.log(error);
          });
      }
      else {
        transportLayer(ajax)
          .GetWebSoftwareComponents()
          .then((webSoftwareComponentsResult) => {
            webSoftwareComponents.current = webSoftwareComponentsResult
            //Register softwareModel components on global scope
            Promise.all(
              importSoftwareModelComponents({
                softwareModels: webSoftwareComponents.current,
                context,
              })
            ).then(() => {
              layoutBriefData.current = {
                DataModelGuid: dataModelGuid,
                Guid: layoutGuid,
                IsDefault: null,
                Label: null,
                PlatformType: null,
                Type: 1,
              };
              webSoftwareComponents.current = webSoftwareComponentsResult;
              setLoading(false);
            });
          });

      }

      if (inLoadableMode) {
        store.store({ getterData: getterLayoutsSavedData.current });
        formApiRef.current = store
      }
    }).catch((e) => {
      console.log(e);
    });
  }, []);


  function handleGetSavedData(getterLayoutsData) {
    getterLayoutsSavedData.current.push(getterLayoutsData);
  }

  return (
    <>
      {!loading && (
        <WrapperLayouts
          layoutGuid={layoutGuid}
          primaryKey={primaryKey}
          mode={mode}
          formApi={formApiRef.current}
          layoutType={layoutBriefData.current.Type}
          dataModelGuid={layoutBriefData.current.DataModelGuid}
          inLoadableMode={inLoadableMode}
          onGetSavedData={handleGetSavedData}
          webSoftwareComponents={webSoftwareComponents.current}
          previewInitialDataForDesigner={previewInitialDataForDesigner}
          context={context}
          widgetsMode={widgetsMode}
          remoteDataSource={remoteDataSource}
          softwareGuid={softwareGuid}
        />
      )}
    </>
  );
}

export default injectContext(FormRenderer);

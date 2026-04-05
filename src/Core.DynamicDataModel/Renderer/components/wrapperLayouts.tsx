import * as React from "react";
import { Message, Spin, useAjax, WrappedFormUtils, injectContext, DidgahContextProps, Alert } from "didgah/ant-core-component";
import { SaveLayoutValueChangesViewModel } from "../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.SaveLayoutValueChangesViewModel";
import { SaveRowViewModel } from "../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.SaveRowViewModel";
import transportLayer from "../transportLayer";
import DefineLayout from "./defineLayout/defineLayout";
import DefineArchiveLayout from "./defineArchiveLayout/defineArchiveLayout";
import ArchiveLayout from "./archiveLayout/archiveLayout";
import InlineArchiveLayout from "./inlineArchiveLayout/inlineArchiveLayout";
import { translate } from '../../../Utility/language';
import { LayoutType } from "../../../Models/Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.LayoutType";
import { InitialArchiveFormDataType, InitialDefineFormDataType, SaveDataViewModel } from "../../../typings/Core.DynamicDataModel/Types";
import { LayoutValueResponseViewModel } from "../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.LayoutValueResponseViewModel";
import { WebSoftwareComponentViewModel } from "../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.WebSoftwareComponentViewModel";
import { WidgetType } from "../../../typings/Core.DynamicDataModel/Enums";
import { LayoutValueByPrimaryKeyResponseViewModel } from "../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.LayoutValueByPrimaryKeyResponseViewModel";
import { FormApiProvider, FormApiType } from "./useWrapperLayout";


export interface RemoteDataSource {
  url: string;
  metadata?: any;
  extraData?: any;
}

export interface WrapperLayoutProps {
  layoutGuid: string;
  dataModelGuid: string;
  inLoadableMode: boolean;
  mode: 'add' | 'edit';
  primaryKey?: string;
  layoutType?: LayoutType;
  context?: DidgahContextProps;
  onGetSavedData?: (fn) => void;
  widgetsMode?: WidgetType;
  previewInitialDataForDesigner?: LayoutValueResponseViewModel;
  webSoftwareComponents: Array<WebSoftwareComponentViewModel>;
  remoteDataSource?: RemoteDataSource;
  softwareGuid?: string;
  isSimpleDesignerMode?: boolean;
  formApi?: FormApiType
}
export const layoutComponents = {
  [LayoutType.Define]: DefineLayout,
  [LayoutType.Archive]: ArchiveLayout,
  [LayoutType.DefineArchive]: DefineArchiveLayout,
  [LayoutType.InlineArchive]: InlineArchiveLayout
}

function WrapperLayouts({
  primaryKey = undefined,
  layoutGuid,
  mode,
  layoutType,
  dataModelGuid,
  context,
  inLoadableMode,
  widgetsMode,
  onGetSavedData = () => { },
  previewInitialDataForDesigner,
  webSoftwareComponents,
  remoteDataSource,
  softwareGuid,
  isSimpleDesignerMode,
  formApi = null
}: WrapperLayoutProps) {

  const ajax = useAjax();
  const Component = React.useRef(null);
  function handleSave(savedData: SaveDataViewModel) {
    const data: SaveLayoutValueChangesViewModel = {
      LayoutGuid: layoutGuid,
      Rows: savedData.rows
    }

    // Because of save API that must be => Row.length > 0 
    if (!!savedData.validationResult && savedData.validationResult.succeedded && data.Rows.length === 0) {
      Message.success(translate('YourOperationDoneSuccessfully'));
      context.commandHandler.closeWindow();
      return
    }

    if (!!savedData.validationResult && savedData.validationResult.succeedded) {
      transportLayer(ajax).Save(data).then((result) => {
        if (!!result) {
          Message.success(translate('YourOperationDoneSuccessfully'));
          context.commandHandler.closeWindow();
        }
      });
    }
  }

  switch (layoutType) {
    case LayoutType.Archive:
    case LayoutType.InlineArchive:
    case LayoutType.DefineArchive:
      if (widgetsMode === WidgetType.SearchWidget) {
        return <div style={{
          margin: "20px",
          textAlign: "center",
          direction: "rtl",
        }}><Alert type={"warning"} message={translate("UnsupportedWidgetMode")} showIcon></Alert></div>
      }
      Component.current = layoutComponents[layoutType];
      break;
    case LayoutType.Define:
      Component.current = layoutComponents[layoutType];
      break;
  }
  return (
    <FormApiProvider value={formApi ?? null}>
      <Component.current
        layoutGuid={layoutGuid}
        dataModelGuid={dataModelGuid}
        mode={mode}
        primaryKey={primaryKey}
        onSave={handleSave}
        inLoadableMode={inLoadableMode}
        onGetSavedData={onGetSavedData}
        widgetsMode={widgetsMode}
        previewInitialDataForDesigner={previewInitialDataForDesigner}
        webSoftwareComponents={webSoftwareComponents}
        context={context}
        remoteDataSource={remoteDataSource}
        layoutComponents={layoutComponents}
        softwareGuid={softwareGuid}
        isSimpleDesignerMode={isSimpleDesignerMode}
        parentInitialData={{
          Guid: layoutGuid,
        }}
      /></FormApiProvider>
  );
}

export default WrapperLayouts;

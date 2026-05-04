import * as React from "react";
import App from "./FormDesigner";
import { Provider, ProviderProps } from "react-redux";
import { store } from "./store";
import { LayoutDesignerCommandHandlerParameter } from "../../typings/Core.DynamicDataModel/Types";

const ExtendedProvider = Provider  as React.ComponentType<ProviderProps<any> & {
  children: React.ReactNode}>;
const FormDesigner = (props: LayoutDesignerCommandHandlerParameter & { scopeGuid: string; }) => {
  const { mode, layoutGuid, dataModelGuid, layoutType, parentGuid,copyFormAppFn, plugins, scopeGuid, softwareGuid } = props;
  return (
    <ExtendedProvider store={store}>
      <App
        mode={mode}
        layoutGuid={layoutGuid}
        dataModelGuid={dataModelGuid}
        layoutType={layoutType}
        parentGuid={parentGuid}
        plugins={plugins}
        copyFormAppFn={copyFormAppFn}
        scopeGuid={scopeGuid}
        softwareGuid={softwareGuid}
        />
    </ExtendedProvider>
  );
};

export default FormDesigner;

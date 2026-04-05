import * as React from "react";
import { IWidget } from "../../../typings/Core.DynamicDataModel/Types";
import { injectContext } from "didgah/ant-core-component";
import LayoutRenderer from '../../Renderer/layoutRenderer';
import useDDMFormRenderer from "../../Renderer/useLayoutRenderer";

const ReferenceDefineViewer = (props: any) => {
  const { layout, context, dataModelGuid, layouts, dataModels, mode } = props;
  const { getFormData, store } = useDDMFormRenderer();

  return mode === 'design' ? <LayoutRenderer
    inLoadableMode={true}
    layoutGuid={layout.Guid}
    mode={'add'}
    dataModelGuid={props.layout.dataModelGuid}
    primaryKey={undefined}
    context={context}
    previewInitialDataForDesigner={{ Layouts: layouts, DataModels: dataModels, Rows: [] }}
    store={store}
  >
  </LayoutRenderer> : null
};

export default {
  component: injectContext(ReferenceDefineViewer),
} as IWidget;

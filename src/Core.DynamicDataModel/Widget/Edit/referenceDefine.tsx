import * as React from "react";
import { IWidget } from "../../../typings/Core.DynamicDataModel/Types";
import { Form, injectContext, useAjax } from "didgah/ant-core-component";
import LayoutRenderer from '../../Renderer/layoutRenderer';
import useDDMFormRenderer from "../../Renderer/useLayoutRenderer";

const ReferenceDefineEditor = (props: any) => {
  const {
    layout,
    primaryKey,
    context,
    layouts,
    dataModels,
    mode
  } = props;
  const { getFormData, store } = useDDMFormRenderer();
  return (
    mode === 'design' ? <LayoutRenderer
      inLoadableMode={true}
      dataModelGuid={props.layout.DataModelGuid}
      layoutGuid={layout.Guid}
      mode={'add'}
      primaryKey={undefined}
      context={context}
      previewInitialDataForDesigner={{ Layouts: layouts, DataModels: dataModels, Rows: [] }}
      store={store}
    >
    </LayoutRenderer> : null
  )
};

export default {
  component: injectContext(Form.create({})(ReferenceDefineEditor)),
} as IWidget;

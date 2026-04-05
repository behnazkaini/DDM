import * as React from "react";
import { LayoutViewModel } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.LayoutViewModel";
import { LayoutValueResponseViewModel } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.LayoutValueResponseViewModel";
import {
	Col,
	Form,
	FormComponentProps,
	FormLayout,
	Spin,
	useAjax,
} from "didgah/ant-core-component";
import { WidgetFactory } from "../../../Widget/WidgetFactory";
import SetupData from "./setupArchiveLayoutData";
import LayoutManager from "../../../LayoutManager";
import transportLayer from "../../transportLayer";
import { ComponentModel, RendererLayoutProps } from "../../../../typings/Core.DynamicDataModel/Types";

interface State {
  initialData: LayoutValueResponseViewModel;
  loading: boolean;
  currentLayout: LayoutViewModel
}

interface Action {
  type: string;
  payload: unknown;
}

const initialState: State = {
  initialData: {
    DataModels: undefined,
    Layouts: undefined,
    Rows: undefined
  },
  loading: true,
  currentLayout: null,
};

type RenderInParentComp = {
  hasParent?: true,
  parentInitialData: LayoutValueResponseViewModel
}

type RenderWithoutParent = {
  hasParent?: false,
  parentInitialData?: never
}

type ArchiveLayoutProps = (RenderInParentComp | RenderWithoutParent) & RendererLayoutProps<LayoutValueResponseViewModel>;


function ArchiveLayout({ hasParent = false, widgetsMode, parentInitialData, layoutGuid, dataModelGuid, inLoadableMode, previewInitialDataForDesigner, webSoftwareComponents, context, primaryKey, softwareGuid, isSimpleDesignerMode }: ArchiveLayoutProps) {
  const ajax = useAjax();
  function reducer(state: State, action: Action): State {
    switch (action.type) {
      case "SET_LOADING":
        return {
          ...state,
          loading: false,
        };

      case "INIT_AND_SET_LOADING":
        const data = action.payload as LayoutValueResponseViewModel;
        return {
          ...state,
          loading: false,
          currentLayout: (data as any).currentLayout,
          initialData: {
            DataModels: data.DataModels,
            Layouts: data.Layouts,
            Rows: data.Rows
          },
        };

      default:
        return { ...state };
    }
  }

  const [state, dispatch] = React.useReducer(reducer, initialState);
  const { loading, currentLayout } = state;
  const widgetFactory = React.useRef<WidgetFactory>(null);
  const layoutManager = React.useRef<LayoutManager>(null);
  const dataSetup = React.useRef(null);

  React.useEffect(() => {
    const getSetupData = () => {
      if (!hasParent) {
        transportLayer(ajax).GetValue({ LayoutGuid: layoutGuid }).then((result: LayoutValueResponseViewModel) => {
          setupManagers(result);
        })
      }
      else {
        setupManagers(parentInitialData);
      }
    }

    if (!previewInitialDataForDesigner) {
      getSetupData()
    }
    else {
      setupManagers(previewInitialDataForDesigner)
    }

  }, []);

  function setupManagers(result: LayoutValueResponseViewModel) {
    const layout = result.Layouts.find((x) => x.Guid.toLowerCase() == layoutGuid.toLocaleLowerCase());
    widgetFactory.current = new WidgetFactory({
      dataModelGuid,
      layoutGuid,
      layoutModel: result,
      softwareModels: webSoftwareComponents,
      context,
      isSimpleDesignerMode
    });
    layoutManager.current = new LayoutManager({
      LayoutsModel: {
        DataModels: result.DataModels,
        Layouts: result.Layouts,
        WidgetFactory: widgetFactory.current,
        WidgetsMode: widgetsMode
      },
      context,
      isSimpleDesignerMode
    });
    dataSetup.current = new SetupData({ widgetFactory: widgetFactory.current, initialData: result, currentLayout: layout });

    dispatch({
      type: "INIT_AND_SET_LOADING",
      payload: {
        DataModels: result.DataModels,
        Layouts: result.Layouts,
        Rows: result?.Rows,
        currentLayout: layout
      } as LayoutValueResponseViewModel,
    });
  }

  function handleChange(data) {

  }

  function getComponent() {
    const componentData = layoutManager.current.getLayoutComponent(currentLayout);
    const ComponentElement = (componentData.component as any).component;
    const componentProps = {
      ...componentData.setting,
      initValue: dataSetup.current.data,
      layoutGuid: parentInitialData?.Guid,
      primaryKey,
      softwareGuid,
      mode: 'render',
      label: currentLayout.Label,
      validationRules: { ...componentData.rule, ...(componentData as ComponentModel).dataModelSetting }
    };
    if (!!ComponentElement) {
      return (
        <Form.Item label={currentLayout.Label} wrapperCol={{ span: 24 }} className='didgah-ddm-renderer'>
          <ComponentElement {...componentProps} onChangeDataTable={handleChange}></ComponentElement>
        </Form.Item>
      )
    }
    return;
  }

  return (<>
    {!inLoadableMode ? <FormLayout>
      <FormLayout.LayoutContent>
        <Spin spinning={loading}>
          {!loading && getComponent()}
        </Spin>
      </FormLayout.LayoutContent>
    </FormLayout> : <Spin spinning={loading}>
      {!loading && getComponent()}
    </Spin>}
  </>

  );
}

export default Form.create({})(ArchiveLayout);

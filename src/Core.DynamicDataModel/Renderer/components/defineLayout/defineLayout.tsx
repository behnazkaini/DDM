import React, { useReducer, useRef, useEffect } from "react";
import { translate } from "../../../../Utility/language";
import { LayoutValueByPrimaryKeyResponseViewModel } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.LayoutValueByPrimaryKeyResponseViewModel";

import {
  Button,
  Form,
  FormComponentProps,
  FormLayout,
  Spin,
  useAjax,
} from "didgah/ant-core-component";
import {
  RendererLayoutProps,
} from "../../../../typings/Core.DynamicDataModel/Types";
import { LayoutViewModel } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.LayoutViewModel";
import { WidgetFactory } from "../../../Widget/WidgetFactory";
import SetupData from "./setupDefineLayoutData";
import LayoutManager from "../../../LayoutManager";
import transportLayer from "../../transportLayer";
import { ISetupData } from "../../../../typings/Core.DynamicDataModel/Types";
import ComplexValidator from "../validation/complexValidator";
import LayoutContent from "./layoutContent";
import { SaveRowViewModel } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.SaveRowViewModel";
import { RowViewModel } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.RowViewModel";
import { KeyValueViewModel } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.KeyValueViewModel";
import { FormStore, createFormStore } from "../../store/FormValuesStore";
import { buildDerivationGraph } from "../../store/derivationParser";

interface State {
  initialData: LayoutValueByPrimaryKeyResponseViewModel;
  loading: boolean;
  currentLayout: LayoutViewModel;
  initialDataSetup: ISetupData;
}

interface Action {
  type: string;
  payload: unknown;
}

const initialState: State = {
  initialData: {
    DataModels: undefined,
    Layouts: undefined,
    Row: undefined,
    Variables: undefined,
  },
  loading: true,
  currentLayout: null,
  initialDataSetup: null,
};

type RenderInParentComp = {
  hasParent?: true;
  parentInitialData?: any;
};

type RenderWithoutParent = {
  hasParent?: false;
  parentInitialData?: never;
};
// interface DefineLayoutWithOnGetSavedData extends Omit<RendererLayoutProps, 'onGetSavedData'> {
//   onGetSavedData: number
// }

type DefineLayoutProps = (RenderInParentComp | RenderWithoutParent) &
  RendererLayoutProps<LayoutValueByPrimaryKeyResponseViewModel> &
  FormComponentProps & {
    getFormFunction?: (form: any) => void
  };

function DefineLayout({
  hasParent = false,
  widgetsMode,
  onGetSavedData = () => undefined,
  inLoadableMode,
  parentInitialData,
  mode = "edit",
  onSave,
  dataModelGuid,
  primaryKey,
  layoutGuid,
  previewInitialDataForDesigner,
  form,
  webSoftwareComponents,
  context,
  remoteDataSource,
  layoutComponents,
  softwareGuid,
  isSimpleDesignerMode,
  getFormFunction
}: DefineLayoutProps) {
  function reducer(state: State, action: Action): State {
    switch (action.type) {
      case "SET_LOADING":
        return {
          ...state,
          loading: false,
        };

      case "INIT_AND_SET_LOADING_AND_SETUPDATA":
        const data = action.payload as LayoutValueByPrimaryKeyResponseViewModel;
        return {
          ...state,
          loading: false,
          currentLayout: (data as any).currentLayout,
          initialData: {
            DataModels: data.DataModels,
            Layouts: data.Layouts,
            Row: data.Row,
            Variables: data.Variables,
          },
          initialDataSetup: (data as any).initialDataSetup,
        };

      default:
        return { ...state };
    }
  }

  const ajax = useAjax();
  const [state, dispatch] = useReducer(reducer, initialState);
  const { loading, currentLayout, initialData, initialDataSetup } = state;
  const widgetFactory = useRef<WidgetFactory>(null);
  const layoutManager = useRef<LayoutManager>(null);
  const validator = useRef<ComplexValidator>(null);
  const variables = useRef<KeyValueViewModel<string, Object>[]>(null);
  const designSetting = useRef(null);
  const storeRef = useRef<FormStore>(null);
  const getSavedAndValidationData = useRef(null);

  useEffect(() => {
    const getSetupData = () => {
      if (!hasParent) {
        if (mode === "edit") {
          //const data: LayoutValueByPrimaryKeyRequestViewModel
          const data: any = {
            LayoutGuid: layoutGuid,
            PrimaryKey: primaryKey,
            SoftwareGuid: softwareGuid
          };
          if (remoteDataSource) {
            context.ajax.post(remoteDataSource.url, remoteDataSource?.metadata).then(result => {
              if (!!result) {
                setupManagers(result);
              }
            });
          } else {
            transportLayer(ajax)
              .GetValueByPrimaryKey(data)
              .then((result: LayoutValueByPrimaryKeyResponseViewModel) => {
                setupManagers(result);
              });
          }
        } else {
          transportLayer(ajax)
            .GetLayoutByGuid({ Guid: layoutGuid })
            .then((result) => {
              if (remoteDataSource) {
                context.ajax.post(remoteDataSource.url, remoteDataSource?.metadata).then(dataSourceResult => {
                  if (!!dataSourceResult) {
                    setupManagers({ ...result, ...dataSourceResult });
                  }
                });
              }
              else {
                setupManagers(result);
              }
            });
        }
      } else {
        setupManagers(
          parentInitialData as LayoutValueByPrimaryKeyResponseViewModel
        );
      }
    };

    if (!previewInitialDataForDesigner) {
      getSetupData();
    } else {
      setupManagers(previewInitialDataForDesigner as any);
    }
    getFormFunction?.(form)
  }, []);

  const setupManagers = (result: Omit<LayoutValueByPrimaryKeyResponseViewModel, 'Row'> & { Row: SaveRowViewModel[] | RowViewModel<any> }) => {

    const layout = result.Layouts.find(
      (x) => x.Guid.toLowerCase() == layoutGuid.toLocaleLowerCase()
    );
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
      },
      context,
      isSimpleDesignerMode
    });

    validator.current = new ComplexValidator({
      layouts: result.Layouts,
      dataModels: result.DataModels,
    });

    variables.current = result.Variables;

    designSetting.current =
      layoutManager.current.getDesignSettingOfLayout(layout);

    // Build the data-driven derivation graph from the layout's Design events.
    // No Blockly runtime is used; the CodeXml is parsed by regex in derivationParser.
    const graph = buildDerivationGraph(designSetting.current.Events, layout, result.Layouts);

    // Seed the store with the server's initial row data so the very first
    // derivation run (inside createFormStore) sees real values, not zeros.
    const initialFields: Record<string, any> = {};
    const initialGridRows: Record<string, Record<string, any>[]> = {};
    const seedRow = result?.Row as any;
    if (seedRow?.KeyValues) {
      (seedRow.KeyValues as any[]).forEach((kv: any) => {
        if (Array.isArray(kv.Value)) {
          // Grid / composition relation — convert to column-keyed flat rows.
          initialGridRows[kv.Key] = (kv.Value as any[]).map((rowItem: any) => {
            const rec: Record<string, any> = { Guid: rowItem.PrimaryKey };
            (rowItem.KeyValues ?? []).forEach((colKv: any) => {
              rec[colKv.Key] = colKv.Value;
            });
            return rec;
          });
        } else {
          initialFields[kv.Key] = kv.Value;
        }
      });
    }

    storeRef.current = createFormStore(graph, initialFields, initialGridRows);

    // Pass empty events to SetupData — derivations are now handled by the store.
      const data = new SetupData({
        widgetFactory: widgetFactory.current,
        initialData: result as any,
        currentLayout: layout,
        events: [],
      });
      dispatch({
        type: "INIT_AND_SET_LOADING_AND_SETUPDATA",
        payload: {
          DataModels: result.DataModels,
          Layouts: result.Layouts,
          Row: result?.Row,
          Variables: result?.Variables,
          currentLayout: layout,
          initialDataSetup: data,
        } as LayoutValueByPrimaryKeyResponseViewModel,
      });
  };

  function handleSave() {
    form.validateFields((errors, formData) => {
      if (!!errors) {
        return;
      }
      getSavedAndValidationData.current().then((result) => {
        onSave(result);
      });
    });
  }

  function handleGetSavedAndValidationData(handler) {
    getSavedAndValidationData.current = handler;
  }

  const content = (
    <>
      <Spin spinning={loading} stretch={true}>
        {!loading && (
          <LayoutContent
            currentLayout={currentLayout}
            designSetting={designSetting.current}
            initialData={initialData}
            initialDataSetup={initialDataSetup}
            layoutManager={layoutManager.current}
            primaryKey={primaryKey}
            validator={validator.current}
            mode={mode}
            variables={variables.current}
            onGetSavedData={onGetSavedData}
            widgetFactory={widgetFactory.current}
            form={form}
            onSaveAndValidationData={handleGetSavedAndValidationData}
            widgetsMode={widgetsMode}
            previewInitialDataForDesigner={previewInitialDataForDesigner}
            webSoftwareComponents={webSoftwareComponents}
            context={context}
            layoutComponents={layoutComponents}
            isSimpleDesignerMode={isSimpleDesignerMode}
            store={storeRef.current}
          />
        )}
      </Spin>
    </>
  );

  return (
    <>
      {!inLoadableMode ? (
        <FormLayout>
          <FormLayout.LayoutContent>{content}</FormLayout.LayoutContent>
          <FormLayout.ActionBar>
            <Button onClick={handleSave} type="primary">
              {translate("Save")}
            </Button>
          </FormLayout.ActionBar>
        </FormLayout>
      ) : (
        content
      )}
    </>
  );
}

export default Form.create({})(DefineLayout);

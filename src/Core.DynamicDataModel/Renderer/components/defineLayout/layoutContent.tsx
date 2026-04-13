import * as React from "react";
import RecursiveComponents from './recursiveComponents';
import { translate } from '../../../../Utility/language';
import { LayoutValueByPrimaryKeyResponseViewModel } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.LayoutValueByPrimaryKeyResponseViewModel";

import {
  DidgahContextProps,
  FormComponentProps,
  Modal,
} from "didgah/ant-core-component";
import { Design, GetterSavedDataProps, SaveDataViewModel } from "../../../../typings/Core.DynamicDataModel/Types";
import useDefineLayoutHook from './useDefineLayoutHook';
import { LayoutViewModel } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.LayoutViewModel";
import { WidgetFactory } from "../../../Widget/WidgetFactory";
import LayoutManager from "../../../LayoutManager";
import { ISetupData } from '../../../../typings/Core.DynamicDataModel/Types';
import ComplexValidator from '../validation/complexValidator';
import { WidgetType } from "../../../../typings/Core.DynamicDataModel/Enums";
import { LayoutValueResponseViewModel } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.LayoutValueResponseViewModel";
import { WebSoftwareComponentViewModel } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.WebSoftwareComponentViewModel";
import { KeyValueViewModel } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.KeyValueViewModel";
import { useFormApi } from "../useWrapperLayout";
import { FormStore, useFormStore } from "../../store/FormValuesStore";


interface ContentProps extends FormComponentProps {
  mode: 'add' | 'edit';
  currentLayout: LayoutViewModel;
  onSaveAndValidationData: (data: () => Promise<SaveDataViewModel>) => void;
  primaryKey: string;
  validator: ComplexValidator;
  initialData: LayoutValueByPrimaryKeyResponseViewModel;
  initialDataSetup: ISetupData;
  onGetSavedData: (data: () => GetterSavedDataProps | Promise<GetterSavedDataProps>) => void;
  widgetFactory: WidgetFactory;
  layoutManager: LayoutManager;
  designSetting: Design;
  variables: KeyValueViewModel<string, Object>[],
  widgetsMode?: WidgetType;
  previewInitialDataForDesigner?: LayoutValueResponseViewModel;
  webSoftwareComponents: Array<WebSoftwareComponentViewModel>;
  context: DidgahContextProps;
  layoutComponents?: { element: JSX.Element };
  isSimpleDesignerMode: boolean;
  store: FormStore;
}

function LayoutContent({ variables, mode, currentLayout, widgetsMode, onSaveAndValidationData, layoutComponents, primaryKey, validator, widgetFactory, layoutManager, designSetting, initialData, initialDataSetup, previewInitialDataForDesigner, onGetSavedData, form, webSoftwareComponents, context, isSimpleDesignerMode, store }: ContentProps) {

  React.useEffect(() => {
    onGetSavedData(getterSavedData());
    onSaveAndValidationData(getSavedAndValidationData)
  }, []);

  // Push derived values into the AntD form whenever derived changes.
  const derived = useFormStore(store, state => state.derived);
  React.useEffect(() => {
    if (Object.keys(derived).length > 0) {
      form.setFieldsValue(derived);
    }
  }, [derived]);

  const {
    getSavedAndValidationData,
    getterSavedData,
    setGetterSubLayoutData,
    showValidationError,
    hideValidationError,
    setChangedLayoutItemGuid,
    getChangedLayoutItemGuid,
  } = useDefineLayoutHook({
    mode,
    form,
    currentLayout,
    initialData,
    initialDataSetup,
    primaryKey,
    validator,
    widgetFactory,
    layoutManager,
    store,
  });
  const formApi = useFormApi();
  const getComponentData = (layoutItemGuid) => {
    if (!!widgetsMode) {
      return widgetFactory.getComponentByMode(layoutItemGuid, widgetsMode);
    }
    return widgetFactory.getComponent(layoutItemGuid);
  }

  const showValidationErrorModal = () => {
    Modal.error({
      title: translate('Error'),
      content: <ul>{showValidationError.message}</ul>,
      onOk: hideValidationError
    })
  }

  function handleGetSavedData(getterSubLayoutsData) {
    setGetterSubLayoutData(getterSubLayoutsData)
  }

  return (
    <>
      {designSetting.Arrangement.map((design, index) => {
        return <RecursiveComponents
          design={design}
          widgetFactory={widgetFactory}
          dataSetup={initialDataSetup}
          layoutManager={layoutManager}
          form={form}
          currentLayout={currentLayout}
          key={index}
          variables={variables}
          mode={mode}
          primaryKey={primaryKey}
          getComponent={getComponentData}
          onGetSavedData={handleGetSavedData}
          widgetsMode={widgetsMode}
          previewInitialDataForDesigner={previewInitialDataForDesigner}
          webSoftwareComponents={webSoftwareComponents}
          context={context}
          layoutComponents={layoutComponents}
          setChangedLayoutItemGuid={setChangedLayoutItemGuid}
          getChangedLayoutItemGuid={getChangedLayoutItemGuid}
          isSimpleDesignerMode={isSimpleDesignerMode}
          formApi={formApi}
          store={store}
        />;
      })}
      {
        !!showValidationError && !showValidationError.succeedded && showValidationErrorModal()
      }
    </>

  )

}

export default LayoutContent;
import { Button, DidgahContextProps, Modal } from 'didgah/ant-core-component'
import { LayoutValueResponseViewModel } from '../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.LayoutValueResponseViewModel';
import * as React from 'react'
import { ComplexValidationResultProps, GetterSavedDataProps, ISetupData, ValidationResult } from '../../../../typings/Core.DynamicDataModel/Types';
import DefineLayout from '../defineLayout/defineLayout'
import { SaveRowViewModel } from '../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.SaveRowViewModel';
import { KeyValueViewModel } from '../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.KeyValueViewModel';
import { RowViewModel } from '../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.RowViewModel';
import { translate } from 'didgah/common';
import { WebSoftwareComponentViewModel } from '../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.WebSoftwareComponentViewModel';
import { WidgetType } from '../../../../typings/Core.DynamicDataModel/Enums';
import { RowState } from '../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.RowState';

export interface DefineLayoutModalProps {
  visibleDefineForm: boolean;
  selectedRecord: any;
  onOk: (mode: 'add' | 'edit' | 'display', closable?: boolean) => void
  onCancel: () => void;
  initialData: LayoutValueResponseViewModel
  currentLayout: any;
  onGetSavedData: (data: () => GetterSavedDataProps | Promise<GetterSavedDataProps>) => void;
  mode: 'add' | 'edit' | 'display'
  dataSetup: ISetupData,
  showValidationError: ValidationResult,
  onHideValidationError: () => void;
  widgetsMode?: WidgetType;
  previewInitialDataForDesigner?: LayoutValueResponseViewModel;
  webSoftwareComponents: Array<WebSoftwareComponentViewModel>;
  context: DidgahContextProps;
  layoutComponents?: { element: JSX.Element };
  softwareGuid?: string;
  impossibilityAdd?: boolean;
}
export default function DefineLayoutModal({
  visibleDefineForm,
  currentLayout,
  onCancel,
  onOk,
  dataSetup,
  initialData,
  mode,
  onGetSavedData,
  onHideValidationError,
  selectedRecord,
  showValidationError,
  widgetsMode,
  previewInitialDataForDesigner,
  webSoftwareComponents,
  context,
  layoutComponents,
  softwareGuid,
  impossibilityAdd
}: DefineLayoutModalProps) {
  const form = React.useRef<any>()
  function getKeyValueList(row: RowViewModel<any>, selectedRecord) {
    const keyValueList: KeyValueViewModel<string, Object>[] = [];
    const extraDataFormThatIsNotOnRecord = !!row ? [...row.KeyValues] : [];
    for (const key in selectedRecord) {
      if (key.indexOf('__') === -1 && key.indexOf('Guid') === -1 && key.indexOf('index') === -1) {
        const recordDataIndex = extraDataFormThatIsNotOnRecord.findIndex(x => x.Key === key);
        if (recordDataIndex !== -1 || !extraDataFormThatIsNotOnRecord.length) {
          const columnData = dataSetup.data.find(x => x.rowKey === key);
          let saveRowViewModelDataTable;
          const layoutItem = columnData ? dataSetup.getLayoutItem(columnData.layoutItemGuid) : undefined;
          if (!!columnData && layoutItem) {

            saveRowViewModelDataTable = dataSetup.convertDataTableToSaveRowViewModel(columnData, selectedRecord, selectedRecord.Guid, 'show');
          }
          if (!!saveRowViewModelDataTable) {
            keyValueList.push({
              Key: saveRowViewModelDataTable.Key,
              Value: saveRowViewModelDataTable?.Value ?? null
            })
          }
          else {
            if (typeof selectedRecord[key] === 'object' && selectedRecord[key] !== null) keyValueList.push(selectedRecord[key])
            else keyValueList.push({ Key: key, Value: selectedRecord[key] })

          }
          extraDataFormThatIsNotOnRecord?.splice(recordDataIndex, 1);
        }
      }
    }
    extraDataFormThatIsNotOnRecord.forEach(x => {
      keyValueList.push(x)
    })
    return keyValueList
  }

  const rowInitialData = React.useRef(!!selectedRecord ? {
    PrimaryKey: selectedRecord.Guid,
    KeyValues: getKeyValueList(initialData.Rows?.find(x => x.PrimaryKey === selectedRecord.Guid), selectedRecord),
    State: RowState.Unchanged
  } : undefined).current;


  async function handleOk() {
    await onOk(mode)
  }

  const handleConfirmAndAdd = async () => {
    await onOk(mode, false)
    const fieldsValue = form.current.getFieldsValue()
    const emptyFields = {}
    Object.keys(fieldsValue).forEach((key) => {
      emptyFields[key] = undefined
    })
    form.current.setFieldsValue(emptyFields)
  }

  const showValidationErrorModal = () => {
    Modal.error({
      title: translate('Error'),
      content: <ul>{showValidationError.message}</ul>,
      onOk: onHideValidationError
    })
  }

  function getCustomFooter() {
    return <>
      {(!impossibilityAdd && mode !== 'display') && <Button onClick={handleConfirmAndAdd} type='primary'>{translate("ConfirmAndAddNew")}</Button>}
      {mode !== 'display' && <Button onClick={handleOk} type='primary'>{translate("Confirm")}</Button>}
      <Button onClick={onCancel}>{translate("Cancel")}</Button>
    </>
  }
  const setInitailForm = (formData) => {
    form.current = formData
  }

  return (
    <Modal
      visible={visibleDefineForm}
      onCancel={onCancel}
      width={'90%'}
      bodyStyle={{ height: '100%' }}
      style={{ top: 40 }}
      footer={getCustomFooter()}
    >
      <DefineLayout
        layoutGuid={currentLayout.DefineLayoutGuid}
        dataModelGuid={initialData.Layouts.find(x => x.Guid === currentLayout.DefineLayoutGuid).DataModelGuid}
        hasParent={true}
        mode={mode === 'display' ? 'edit' : mode}
        inLoadableMode={true}
        onGetSavedData={onGetSavedData}
        parentInitialData={{
          DataModels: initialData.DataModels,
          Layouts: initialData.Layouts,
          Row: rowInitialData
        }}
        widgetsMode={widgetsMode}
        previewInitialDataForDesigner={previewInitialDataForDesigner}
        webSoftwareComponents={webSoftwareComponents}
        context={context}
        layoutComponents={layoutComponents}
        softwareGuid={softwareGuid}
        getFormFunction={setInitailForm}
      />
      {/* There is an error in next line that is saying showValidationErrorModal is not returning
			 a react node which is correct. Temporary i put an as any here */}
      {(!!showValidationError && !showValidationError.succeedded) ? showValidationErrorModal() as any : ''}
    </Modal>
  )
}
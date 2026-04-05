import * as React from "react";
import { LayoutValueResponseViewModel } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.LayoutValueResponseViewModel";
import {
  Button,
  Form,
  FormComponentProps,
  FormLayout,
  Message,
  Modal,
  Spin,
} from "didgah/ant-core-component";
import { guid, translate } from "didgah/common";
import {
  ActionReferenceArchiveProps,
  ComponentModel,
  GetterSavedDataProps,
  InitialArchiveFormDataType,
  RendererLayoutProps,
} from "../../../../typings/Core.DynamicDataModel/Types";
import useDefineArchiveHook from "./useDefineArchiveHook";
import DefineLayoutModal from "./defineLayoutModal";
import { WidgetType } from "../../../../typings/Core.DynamicDataModel/Enums";

type RenderInParentComp = {
  hasParent?: true;
  parentInitialData?: LayoutValueResponseViewModel;
};

type RenderWithoutParent = {
  hasParent?: false;
  parentInitialData?: never;
};

type DefineArchiveLayoutProps = (RenderInParentComp | RenderWithoutParent) &
  RendererLayoutProps<
    InitialArchiveFormDataType<LayoutValueResponseViewModel>
  > &
  FormComponentProps;

function DefineArchiveLayout({
  hasParent = false,
  layoutComponents,
  onChange = () => null,
  onGetSavedData = () => undefined,
  parentInitialData,
  widgetsMode,
  layoutGuid,
  dataModelGuid,
  onSave,
  form,
  inLoadableMode,
  previewInitialDataForDesigner,
  webSoftwareComponents,
  context,
  remoteDataSource,
  softwareGuid,
  primaryKey,
  isSimpleDesignerMode
}: DefineArchiveLayoutProps) {
  const {
    loading,
    getComponentData,
    setupDataValue,
    getSavedAndValidationData,
    getSavedDataWithoutValidation,
    getterSavedData,
    showDefineForm,
    visibleDefineForm,
    currentLayout,
    initialData,
    hideDefineForm,
    setSelectedRecord,
    selectedRecord,
    setGetterSubLayoutData,
    defineFormMode,
    tableActionHandler,
    handlerActionOnTable,
    getDefineFormData,
    showValidationError,
    hideValidationError,
  } = useDefineArchiveHook({
    hasParent,
    layoutGuid,
    parentInitialData,
    dataModelGuid,
    previewInitialDataForDesigner,
    webSoftwareComponents,
    context,
    remoteDataSource,
    isSimpleDesignerMode
  });

  React.useEffect(() => {
    if (!loading) {
      onGetSavedData(getterSavedData());
    }
  }, [loading]);

  function handleRowClick(record) {
    setSelectedRecord(record);
  }

  function handleAddRecord() {
    if (!validateMaxRow()) return;
    setSelectedRecord(undefined);
    showDefineForm("add");
  }
  function validateMaxRow() {
    const tableData = getSavedDataWithoutValidation();
    const designSetting = JSON.parse(currentLayout.Design).Widget;
    let hasValidate = true
    if (
      designSetting.MaxRow &&
      tableData.rows?.length >= designSetting.MaxRow
    ) {
      Message.warning(
        translate("TableCanNotAddMoreRow")
          .replace("{0}", currentLayout.Label)
          .replace("{1}", designSetting.MaxRow)
      );
      hasValidate = false
    }
    return hasValidate

  }

  function handleEditRecord() {
    if (!selectedRecord) {
      showError();
    } else {
      showDefineForm("edit");
    }
  }
  function handleDisplayRecord() {
    if (!selectedRecord) {
      showError();
    } else {
      showDefineForm("display");
    }
  }

  function handleDeleteRecord() {
    if (!selectedRecord) {
      showError();
    } else {
      const tableData = getSavedDataWithoutValidation();
      const designSetting = JSON.parse(currentLayout.Design).Widget;
      if (
        designSetting.MinRow &&
        tableData.rows?.length <= designSetting.MinRow
      ) {
        Message.warning(
          translate("TableCanNotRemoveMoreRow")
            .replace("{0}", currentLayout.Label)
            .replace("{1}", designSetting.MinRow)
        );
        return;
      }
      Modal.confirm({
        title: translate("AreYouSure"),
        onOk: () => {
          tableActionHandler.deleteRow(selectedRecord.index);
        },
      });
    }
  }

  function showError() {
    Modal.error({
      title: translate("Error"),
      content: translate("SelectOne"),
    });
    return;
  }

  function handleCloseDefineForm() {
    hideDefineForm();
  }

  function setActionOnTable(handler: ActionReferenceArchiveProps) {
    handlerActionOnTable(handler);
  }

  function convertSavedViewModelToDataTable(formData, Guid) {
    const recordData = {};
    const extraRecordDataThatIsNotOnForm = { ...selectedRecord };
    let dataTableSaveViewModel;
    formData.forEach((value) => {
      const recordKey = Object.keys(extraRecordDataThatIsNotOnForm).find(
        (key) => key === value.Key
      );
      const columnData = setupDataValue.data.find(
        (x) => x.rowKey === value.Key
      );

      const layoutItem = columnData ? setupDataValue.getLayoutItem(columnData.layoutItemGuid): undefined;
      if (!!columnData && layoutItem?.Type) {
        
          dataTableSaveViewModel =
            setupDataValue.convertSaveRowViewModelToDataTable(
              columnData,
              value,
              Guid
            );
          recordData[value.Key] = dataTableSaveViewModel;
        
      } else {
        recordData[value.Key] = value;
      }
      if (!!recordKey) {
        delete extraRecordDataThatIsNotOnForm[recordKey];
      }
    });

    for (const key in extraRecordDataThatIsNotOnForm) {
      recordData[key] = extraRecordDataThatIsNotOnForm[key];
    }
    return recordData;
  }

  function getAddedRow(savedAndValidation: GetterSavedDataProps) {
    const Guid = guid.newGuid();
    return {
      ...convertSavedViewModelToDataTable(
        savedAndValidation.value[0].KeyValues,
        Guid
      ),
      Guid,
    };
  }

  function getEditedRow(savedAndValidation: GetterSavedDataProps) {
    return {
      ...convertSavedViewModelToDataTable(
        savedAndValidation.value[0].KeyValues,
        selectedRecord.Guid
      ),
      Guid: selectedRecord.Guid,
    };
  }

  async function handleOkDefineForm(mode, closable = true) {
    const savedAndValidation = await getDefineFormData();
    if (
      !!savedAndValidation.validationResult &&
      !savedAndValidation.validationResult?.succeedded
    ) {
      Modal.error({
        title: translate("Error"),
        content: <ul>{savedAndValidation.validationResult.message}</ul>,
      });
      return;
    } else {
      switch (mode) {
        case "add": {
          if (!validateMaxRow()) return;
          tableActionHandler.addNewRow(
            tableActionHandler.getData().length + 1,
            getAddedRow(savedAndValidation)
          );
          break;
        }

        case "edit": {
          setSelectedRecord(undefined);
          tableActionHandler.updateRow(
            selectedRecord.index,
            getEditedRow(savedAndValidation)
          );
          break;
        }
        case "display": {
          break;
        }
      }
      if (closable) { handleCloseDefineForm() }
      else { showDefineForm('add') }
    }
  }

  function handleChange() {
    if (tableActionHandler) {
      onChange(
        tableActionHandler.getData(),
        tableActionHandler,
        setupDataValue
      );
    }
  }

  function getArchiveComponent() {
    const componentData = getComponentData();
    const ComponentElement = (componentData.component as any).component;
    const componentProps = {
      ...componentData.setting,
      initValue: setupDataValue.data,
      mode: "render",
      validationRules: {
        ...componentData.rule,
        ...(componentData as ComponentModel).dataModelSetting,
      },
      layoutGuid: parentInitialData?.Guid,
      dataModelGuid,
      primaryKey,
      softwareGuid,
      label: currentLayout.Label,
      onChange: (value, metadata) => handleChange(),
      initialData
    };
    if (!!ComponentElement) {
      return (
        <>
          {widgetsMode !== WidgetType.DisplayWidget &&
            widgetsMode !== WidgetType.SearchWidget &&
            setupDataValue.data.length > 0 &&
            currentLayout?.DefineLayoutGuid && (
              <div style={{ padding: "10px 0" }}>
                {!componentData.setting.layoutDesign.Widget
                  ?.ImpossibilityAdd && (
                    <Button onClick={handleAddRecord}>{translate("Add")}</Button>
                  )}
                <Button onClick={handleEditRecord}>{translate("Edit")}</Button>
                {!componentData.setting.layoutDesign.Widget
                  ?.ImpossibilityRemove && (
                    <Button onClick={handleDeleteRecord}>
                      {translate("Delete")}
                    </Button>
                  )}
              </div>
            )}
          {!!widgetsMode && widgetsMode !== WidgetType.EditWidget && (
            <div style={{ padding: "10px 0" }}>
              <Button onClick={handleDisplayRecord}>{translate("Display")}</Button>
            </div>
          )}
          <Form.Item
            label={currentLayout.Label}
            wrapperCol={{ span: 24 }}
            className='didgah-ddm-renderer'
          >
            {form.getFieldDecorator(layoutGuid)(
              <ComponentElement
                {...componentProps}
                onActionOnTable={setActionOnTable}
                onRowClick={handleRowClick}
              ></ComponentElement>
            )}
          </Form.Item>
        </>
      );
    }
    return;
  }

  const showSaveError = (error: { message: string }) => {
    error && error?.message && Modal.error({
      title: translate("Error"),
      content: error.message,
      onOk: hideValidationError,
    });
  }

  function handleSave() {
    getSavedAndValidationData().then((result) => {
      onSave(result);
    }).catch(showSaveError)
  }

  function handleGetSavedData(getterSubLayoutsData) {
    setGetterSubLayoutData(getterSubLayoutsData);
  }

  const showValidationErrorModal = () => {
    Modal.error({
      title: translate("Error"),
      content: <ul>{showValidationError.message}</ul>,
      onOk: hideValidationError,
    });
  };

  React.useEffect(() => {
    if (!!showValidationError && !showValidationError.succeedded) {
      showValidationErrorModal();
    }
  }, [showValidationError]);

  const content = (<Spin spinning={loading}>
    {!loading && (
      <>
        {getArchiveComponent()}
        {visibleDefineForm && (
          <DefineLayoutModal
            visibleDefineForm={visibleDefineForm}
            selectedRecord={selectedRecord}
            onOk={handleOkDefineForm}
            onCancel={handleCloseDefineForm}
            initialData={initialData as LayoutValueResponseViewModel}
            currentLayout={currentLayout}
            onGetSavedData={handleGetSavedData}
            mode={defineFormMode}
            dataSetup={setupDataValue}
            showValidationError={showValidationError}
            onHideValidationError={hideValidationError}
            widgetsMode={widgetsMode}
            previewInitialDataForDesigner={previewInitialDataForDesigner}
            webSoftwareComponents={webSoftwareComponents}
            context={context}
            layoutComponents={layoutComponents}
            softwareGuid={softwareGuid}
            impossibilityAdd={getComponentData().setting.layoutDesign.Widget?.ImpossibilityAdd}
          />
        )}
      </>
    )}
  </Spin>)
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

export default Form.create({})(DefineArchiveLayout);

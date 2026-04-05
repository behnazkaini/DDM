import { useAjax } from 'didgah/ant-core-component';
import React from 'react';
import { WidgetFactory } from "../../../Widget/WidgetFactory";
import { SaveRowViewModel } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.SaveRowViewModel";
import SetupData from "./setupDefineArchiveLayoutData";
import LayoutManager from "../../../LayoutManager";
import transportLayer from "../../transportLayer";
import { LayoutValueResponseViewModel } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.LayoutValueResponseViewModel";
import { DefineArchiveLayoutViewModel } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.DefineArchiveLayoutViewModel";
import { ComponentModel, ArchiveDataTable, ISetupData, useLayoutsRendererHookProps, UseDefineArchiveHook, IWidgetFactory, GetterSavedDataProps, ComplexValidationResultProps, ValidationResult, ActionReferenceArchiveProps, SaveDataViewModel, TableError, InitialArchiveFormDataType } from '../../../../typings/Core.DynamicDataModel/Types';
import { KeyValueViewModel } from '../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.KeyValueViewModel';
import { RowState } from '../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.RowState';
import ComplexValidator from '../validation/complexValidator';
import { RowViewModel } from '../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.RowViewModel';
import { translate } from 'didgah/common';

interface State {
  initialData: LayoutValueResponseViewModel;
  loading: boolean;
  currentLayout: DefineArchiveLayoutViewModel;
  visibleDefineForm: boolean
  dataSetup: ISetupData;
  selectedRecord: any;
  mode: 'add' | 'edit' | 'display';
  showValidationError: ValidationResult
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
  visibleDefineForm: false,
  dataSetup: null,
  selectedRecord: null,
  mode: 'add',
  showValidationError: null
};


export default function useDefineArchiveLayoutHook({
  hasParent,
  layoutGuid,
  parentInitialData,
  dataModelGuid,
  previewInitialDataForDesigner,
  webSoftwareComponents,
  context,
  remoteDataSource,
  isSimpleDesignerMode
}: useLayoutsRendererHookProps<InitialArchiveFormDataType<LayoutValueResponseViewModel>>): UseDefineArchiveHook {

  function reducer(state: State, action: Action): State {
    switch (action.type) {
      case "SET_LOADING":
        return {
          ...state,
          loading: false,
        };

      case "INIT_AND_SET_LOADING_AND_SETUPDATA":
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
          dataSetup: (data as any).dataSetup,
        };

      case "VISIBLE_DEFINE_FORM":
        return {
          ...state,
          visibleDefineForm: true,
          mode: action.payload as 'add' | 'edit' | 'display'
        };

      case "HIDE_DEFINE_FORM":
        return {
          ...state,
          visibleDefineForm: false
        };

      case "SET_SELECTED_RECORD":
        return {
          ...state,
          selectedRecord: action.payload
        };

      case 'HIDE_DEFINE_FORM_AND_RESET_SELECTED_RECORD':
        return {
          ...state,
          visibleDefineForm: false,
          selectedRecord: null
        }
      case 'SHOW_VALIDATION_ERROR':
        return {
          ...state,
          showValidationError: action.payload as ValidationResult,
        };

      case 'HIDE_VALIDATION_ERROR':
        return {
          ...state,
          showValidationError: null,
        };

      case 'SET_INITIAL_DATA':
        const payload = action.payload as LayoutValueResponseViewModel;
        return {
          ...state,
          initialData: {
            DataModels: payload.DataModels,
            Layouts: payload.Layouts,
            Rows: payload.Rows
          },
        }
      default:
        return { ...state };
    }
  }

  const ajax = useAjax();
  const widgetFactory = React.useRef<IWidgetFactory>(null);
  const layoutManager = React.useRef<LayoutManager>(null);
  const getterSubLayoutsSavedData = React.useRef<Function>(undefined);

  const [state, dispatch] = React.useReducer(reducer, initialState);
  const { loading, currentLayout, initialData, visibleDefineForm, dataSetup, selectedRecord, mode, showValidationError } = state;
  const validator = React.useRef<ComplexValidator>(null);
  const tableActionHandler = React.useRef<ActionReferenceArchiveProps>(undefined);

  React.useEffect(() => {
    const getSetupData = () => {
      if (!hasParent) {
        if (remoteDataSource) {
          context.ajax.post(remoteDataSource.url, remoteDataSource?.metadata).then(result => {
            if (!!result) {
              setupManagers(result);
            }
          });
        } else {
          transportLayer(ajax).GetValue({ LayoutGuid: layoutGuid }).then((result: LayoutValueResponseViewModel) => {
            setupManagers(result);
          })
        }
      }
      else {
        setupManagers(parentInitialData as InitialArchiveFormDataType<LayoutValueResponseViewModel>);
      }
    }

    if (!previewInitialDataForDesigner) {
      getSetupData()
    }
    else {
      setupManagers(previewInitialDataForDesigner as InitialArchiveFormDataType<LayoutValueResponseViewModel>)
    }

  }, []);

  const setupManagers = (result: InitialArchiveFormDataType<LayoutValueResponseViewModel> | LayoutValueResponseViewModel) => {
    const layout = result.Layouts.find((x) => x.Guid.toLowerCase() == layoutGuid.toLocaleLowerCase()) as DefineArchiveLayoutViewModel;

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
        WidgetFactory: widgetFactory.current
      },
      context,
      isSimpleDesignerMode
    });

    const data = new SetupData<LayoutValueResponseViewModel>({ widgetFactory: widgetFactory.current, initialData: result, currentLayout: layout });
    validator.current = new ComplexValidator({ layouts: result.Layouts, dataModels: result.DataModels });

    dispatch({
      type: "INIT_AND_SET_LOADING_AND_SETUPDATA",
      payload: {
        DataModels: result.DataModels,
        Layouts: result.Layouts,
        Rows: result?.Rows,
        currentLayout: layout,
        dataSetup: data,
      } as LayoutValueResponseViewModel,
    });
  }

  const getComponentData = (): ComponentModel => {
    return layoutManager.current.getLayoutComponent(currentLayout);
  }

  const showDefineForm = (mode: 'add' | 'edit' | 'display') => {
    dispatch({ type: 'VISIBLE_DEFINE_FORM', payload: mode })
  }

  const hideDefineForm = () => {
    dispatch({ type: 'HIDE_DEFINE_FORM_AND_RESET_SELECTED_RECORD', payload: null })
  }

  const setSelectedRecord = (record) => {
    dispatch({ type: 'SET_SELECTED_RECORD', payload: record })
  }

  const setGetterSubLayoutData = (getterSubLayoutsData: Function) => {
    getterSubLayoutsSavedData.current = getterSubLayoutsData
  }

  const hideValidationError = () => {
    dispatch({ type: 'HIDE_VALIDATION_ERROR', payload: null });
  }

  const convertDataTableToSaveViewModel = (recordData: Object) => {
    const keyValueList: KeyValueViewModel<string, Object>[] = [];
    for (const key in recordData) {
      if (key.indexOf('__') === -1 && key.indexOf('Guid') === -1 && key.indexOf('index') === -1) {
        let saveRowViewModelDataTable;
        const columnData = dataSetup.data.find(x => x.rowKey === key);

        if (!!columnData) {
          const layoutItem = (dataSetup as any).getLayoutItem(columnData.layoutItemGuid);
          if (layoutItem?.Type) {
            saveRowViewModelDataTable = dataSetup.convertDataTableToSaveRowViewModel(columnData, recordData, (recordData as any).Guid, 'save');
          }
        }
        if (!!saveRowViewModelDataTable) {
          if (!!saveRowViewModelDataTable?.Key) {
            keyValueList.push({
              Key: saveRowViewModelDataTable.Key,
              Value: saveRowViewModelDataTable?.Value ?? null
            })
          }
        }
        else {
          keyValueList.push({
            Key: key,
            Value: recordData[key]?.Value ?? null
          })
        }
      }
    }


    const row = initialData.Rows?.find(x => x.PrimaryKey === (recordData as any).Guid);
    row?.KeyValues?.forEach(x => {
      if (!keyValueList.find(y => y.Key === x.Key)) {
        keyValueList.push(x)
      }
    })
    return keyValueList
  }

  const getKeyValueList = (record, recordKey, state: RowState) => {
    if (state === RowState.Deleted) {
      return []
    }
    return convertDataTableToSaveViewModel(record);
  }

  const resetNestedState = (items) => {
    if (!Array.isArray(items) || items.length === 0) return;

    items.forEach((item) => {
      if (Array.isArray(item.Value)) {
        item.Value.forEach((valueItem) => {
          valueItem.State = RowState.Unchanged;

          if (Array.isArray(valueItem.KeyValues)) {
            resetNestedState(valueItem.KeyValues);
          }
        });
      }
    });
  }

  const getFormData = (dataTable) => {
    let finalResult: any = !!initialData?.Rows ? [...initialData.Rows] : [];
    const addToRows = (aItem, recordKey, state) => {
      finalResult.push({
        PrimaryKey: recordKey,
        KeyValues: getKeyValueList(aItem, recordKey, state),
        State: state
      })
    }
    const getRowKey = (row) => {
      return !!row.Guid ? row.Guid : row.__guid
    }

    dataTable.added.forEach(x => {
      addToRows(x, getRowKey(x), RowState.Added);
    });

    dataTable.deleted.filter(data => data).forEach(x => {
      const recordKey = getRowKey(x);
      const item = finalResult?.find(y => y.PrimaryKey === recordKey);
      const itemIndexInInitialRow = finalResult?.findIndex(y => y.PrimaryKey === recordKey);
      if (item) {
        if (item.State === RowState.Added) {
          finalResult.splice(itemIndexInInitialRow, 1)
        }
        else {
          finalResult.splice(itemIndexInInitialRow, 1)
          addToRows(x, recordKey, RowState.Deleted);
        }
      }
    });

    dataTable.edited.forEach(x => {
      const recordKey = getRowKey(x);
      const item = finalResult?.find(y => y.PrimaryKey === recordKey);
      const itemIndexInInitialRow = finalResult?.findIndex(y => y.PrimaryKey === recordKey);
      if (item) {
        if (item.State === RowState.Added) {
          finalResult.splice(itemIndexInInitialRow, 1);
          addToRows(x, recordKey, RowState.Added);
        }
        else {
          finalResult.splice(itemIndexInInitialRow, 1)
          addToRows(x, recordKey, RowState.Modified);
        }
      }
    });

    const unChangedData = dataTable.data?.filter(x => !x.hasOwnProperty('__status') && x.hasOwnProperty('Guid'));

    unChangedData.forEach(x => {
      const recordKey = getRowKey(x);
      const item = finalResult?.find(y => y.PrimaryKey === recordKey);
      const itemIndexInInitialRow = finalResult?.findIndex(y => y.PrimaryKey === recordKey);

      if (item) {
        if (item.State !== RowState.Added) {
          finalResult.splice(itemIndexInInitialRow, 1)
          addToRows(x, recordKey, RowState.Unchanged);
        }
        if (Array.isArray(item.KeyValues) && item.KeyValues.length > 0) {
          resetNestedState(item.KeyValues);
        }
      }
    });

    return finalResult

  }

  const getFailedRecords = (dataTable: any[], validationResult: ValidationResult) => {
    let result: TableError[] = [];
    if (!validationResult.succeedded) {
      const failedRows = validationResult.result.filter(x => !x.Succeedded);
      failedRows.forEach(row => {
        dataTable.forEach(x => {
          if (x.hasOwnProperty('Guid')) {
            if (x['Guid'] === row.PrimaryKey) {
              result.push({
                keyProperty: 'Guid',
                keyValue: row.PrimaryKey,
                errors: ['dd']
              })
            }

          }
          else {
            if (x['__guid'] === row.PrimaryKey) {
              result.push({
                keyProperty: '__guid',
                keyValue: row.PrimaryKey,
                errors: ['dd']
              })
            }
          }
        });
      });
    }
    return result
  }

  const getSavedDataWithoutValidation = () => {
    const dataTable = { data: tableActionHandler.current.getData(), ...tableActionHandler.current.getChanges() }
    const savedData = getFormData(dataTable);
    return ({ rows: savedData, validationResult: { succeedded: true } });
  }
  const validateTable = () => {
    return new Promise<boolean>((resolve, reject) => {
      if (tableActionHandler.current.validateForms()) {
        resolve(true);
      }
      else {
        reject()
      }
    })
  }

  const getSavedAndValidationData = (loadable?: boolean) => {
    return new Promise<SaveDataViewModel>((resolve, reject) => {
      const dataTable = { data: tableActionHandler.current.getData(), ...tableActionHandler.current.getChanges() }
      const savedData = getFormData(dataTable);
      const tableDesignSetting = JSON.parse(currentLayout.Design).Widget;
      if (tableDesignSetting.MaxRow && savedData?.length > +tableDesignSetting.MaxRow) {
        const validateRes = { succeedded: false, message: translate('TableCanNotAddMoreRow').replace('{0}', currentLayout.Label).replace('{1}', tableDesignSetting.MaxRow) };
        dispatch({ type: 'SHOW_VALIDATION_ERROR', payload: validateRes });
        reject();
      }
      if (tableDesignSetting.MinRow && savedData?.length < +tableDesignSetting.MinRow) {
        const validateRes = { succeedded: false, message: translate('TableCanNotRemoveMoreRow').replace('{0}', currentLayout.Label).replace('{1}', tableDesignSetting.MinRow) };
        dispatch({ type: 'SHOW_VALIDATION_ERROR', payload: validateRes });
        reject();
      }

      validateTable().then(() => {
        const validationResult = validator.current.validateLayout(currentLayout, savedData);
        if (!!validationResult && !validationResult?.succeedded) {
          if (!loadable) {
            dispatch({ type: 'SHOW_VALIDATION_ERROR', payload: validationResult });
          }
          tableActionHandler.current.setInvalidRecords(getFailedRecords(dataTable.data, validationResult));
          reject();
        }
        resolve({ rows: savedData, validationResult });
      }).catch(() => {
        reject({ message: translate('ThereIsAnErrorInTheItem').replace('{n}', `${currentLayout.Label}`) })
      });
    });
  }

  const getDefineFormData = () => {
    return new Promise<GetterSavedDataProps>((resolve, reject) => {
      resolve(getterSubLayoutsSavedData.current())
    })
  }

  function getRowsWithErrors(rows) {
    return rows.filter(row => row.errors && Object.keys(row.errors).length > 0);
  }

  const getSavedDataForParent = (disableValidation?: boolean) => {
    return new Promise<GetterSavedDataProps>((resolve, reject) => {
      if (!!disableValidation) {
        const savedData = getSavedDataWithoutValidation();
        resolve({
          layoutGuid: currentLayout.Guid,
          value: savedData.rows,
          validationResult: savedData.validationResult
        })
      }
      else {
        getSavedAndValidationData(true).then((savedData) => {
          if (!!savedData.rows) {
            resolve({
              layoutGuid: currentLayout.Guid,
              value: savedData.rows,
              validationResult: savedData.validationResult
            })
          }
        }).catch((error) => {
          resolve({
            layoutGuid: currentLayout.Guid,
            value: undefined,
            validationResult: { succeedded: false }
          })
        })
      }
    })
  }

  const getterSavedData = () => {
    return getSavedDataForParent
  }

  const handlerActionOnTable = (handler: ActionReferenceArchiveProps) => {
    tableActionHandler.current = handler
  }

  const setInitialData = (item, primaryKey) => {
    const prevRow = initialData?.Rows.findIndex(x => x.PrimaryKey === primaryKey);
    if (prevRow !== -1) {
      initialData.Rows.splice(prevRow, 1, { PrimaryKey: primaryKey, KeyValues: item.KeyValues })
    }
    dispatch({
      type: 'SET_INITIAL_DATA', payload: {
        DataModels: initialData.DataModels,
        Layouts: initialData.Layouts,
        Rows: initialData.Rows,
      }
    })
  }

  return {
    loading,
    getComponentData,
    setupDataValue: dataSetup,
    getSavedAndValidationData,
    getSavedDataWithoutValidation,
    showDefineForm,
    visibleDefineForm,
    defineFormMode: mode,
    currentLayout,
    initialData,
    hideDefineForm,
    setSelectedRecord,
    selectedRecord,
    getterSavedData,
    getDefineFormData,
    setGetterSubLayoutData,
    showValidationError,
    tableActionHandler: tableActionHandler.current,
    handlerActionOnTable,
    hideValidationError,
  }

}
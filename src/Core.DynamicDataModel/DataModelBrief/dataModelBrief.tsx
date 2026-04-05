import { useState } from "react";
import { ModelerProps } from "../../Core.DynamicDataModel/Modeler/Modeler";
import { translate, utility } from "didgah/common";
import { Button, Fieldset, FormLayout, injectContext, Message, Modal, Switch, useCommandHandler, WrappedFormUtils } from "didgah/ant-core-component";
import { TableExViewStore }  from "didgah/ant-core-component/providers";
import { DataModelBehaviorInformationViewModel } from "../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.DataModelBehaviorInformationViewModel";
import React from "react";
import { Controls } from "../../Models/Chargoon.Didgah.Common.Domain.Enumeration.Controls";
import { DataModelBriefPagedFilterViewModel } from "../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.DataModelBriefPagedFilterViewModel";
import { DataModelBriefViewModel } from "../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.DataModelBriefViewModel";
import { ScopeViewModel } from "../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.ScopeViewModel";
import { DataModelType } from "../../Models/Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.DataModelType";
import DataModelBriefArchive from "./dataModelBriefArchive";
import DataModelBriefFilter from "./dataModelBriefFilter";
import DefineDataModel from "./defineDataModel";
import transporterLayer from "./transporterLayer";
import { LayoutType } from "../../Models/Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.LayoutType";

interface Action {
  type: 'INIT' | 'DEFINE_VISIBILITY' | 'ENABLE_SIMPLEDESIGNER' | 'DISABLE_SIMPLEDESIGNER' | 'SET_BRIEF_ARCHIVE_VISIBLITY' | 'SET_BRIEF_ARCHIVE_VISIBLE'
  payload: any;
}

export interface DataModelBriefProps {
  softwareGuid: string;
  dataModelType: DataModelType;
}

interface DataModelBriefState {
  scopes: ScopeViewModel[];
  behaviors: DataModelBehaviorInformationViewModel[];
  defineVisibility: boolean;
  isSimpleDesignerMode: boolean;
  briefArchiveVisability: boolean;
}

function reducer(state: DataModelBriefState, action: Action): DataModelBriefState {
  switch (action.type) {
    case 'INIT':
      {
        return { ...state, scopes: action.payload.scopes, behaviors: action.payload.behaviors };
      }
    case 'DEFINE_VISIBILITY':
      {
        return { ...state, defineVisibility: action.payload };
      }
    case 'ENABLE_SIMPLEDESIGNER':
      {
        return { ...state, isSimpleDesignerMode: true, briefArchiveVisability: false };
      }
    case 'DISABLE_SIMPLEDESIGNER':
      {
        return { ...state, isSimpleDesignerMode: false, briefArchiveVisability: false };
      }
    case 'SET_BRIEF_ARCHIVE_VISIBLE':
      {
        return { ...state, briefArchiveVisability: true };
      }
    default:
      return { ...state };
  }
}

function DataModelBrief(props: DataModelBriefProps) {

  const { getScopes, getBehaviors } = transporterLayer();
  const commandHandler = useCommandHandler();
  const [searchDisable, setSearchDisable] = useState<boolean>(false);
  const defineForm = React.useRef<WrappedFormUtils>(null);
  const filterForm = React.useRef<WrappedFormUtils>(null);
  const archiveStore = React.useRef<TableExViewStore<DataModelBriefViewModel, string>>(null);

  const [state, dispatch] = React.useReducer(reducer, {
    scopes: [],
    behaviors: [],
    defineVisibility: false,
    isSimpleDesignerMode: false,
    briefArchiveVisability: true
  });

  React.useEffect(() => {
    if (!state.briefArchiveVisability) {
      dispatch({
        type: 'SET_BRIEF_ARCHIVE_VISIBLE',
        payload: true
      });
    } else {
      if (filterForm.current) {
        handleSearch();
      }
    }
  }, [state.briefArchiveVisability]);

  React.useEffect(() => {
    let scopes: ScopeViewModel[];
    let behaviors: DataModelBehaviorInformationViewModel[];

    Promise.all([
      getBehaviors().then(result => behaviors = result),
      getScopes({ SoftwareGuid: props.softwareGuid }).then(result => scopes = result),
    ]).then(() => {
      dispatch({
        type: 'INIT',
        payload: {
          behaviors,
          scopes
        }
      });
    })

  }, []);

  function handleSearch() {
    const data = filterForm.current.getFieldsValue() as DataModelBriefPagedFilterViewModel;
    setSearchDisable(true)
    archiveStore.current.refresh({
      metadata: {
        ...data,
        Type: props.dataModelType,
        SoftwareGuid: props.softwareGuid
      } as DataModelBriefPagedFilterViewModel
    }).then(() => {
      setSearchDisable(false)
    });
  }

  function handleDefine() {
    dispatch({
      type: 'DEFINE_VISIBILITY',
      payload: true
    });
  }

  function handleEdit() {
    const selectedRecord = archiveStore.current.getSelectedRecords()[0];
    if (selectedRecord) {
      openModelerController({
        dataModelGuid: selectedRecord.Guid,
        dataModelType: selectedRecord.Type,
        scopeGuid: selectedRecord.ScopeGuid,
        softwareGuid: selectedRecord.SoftwareGuid,
        mode: 'edit'
      });
    } else {
      Message.error(translate('ChooseRecord'));
    }
  }

  function onDefineOk() {
    defineForm.current.validateFields((errors, data) => {
      if (!!errors) {
        return;
      }
      dispatch({
        type: 'DEFINE_VISIBILITY',
        payload: false
      });
      const scopeGuid = defineForm.current.getFieldValue('scopeGuid');
      if (state.isSimpleDesignerMode) {
        const { dataModelType, softwareGuid } = props
        commandHandler.openControlFormByCode(
          {
            controlCode: Controls.DDM_LayoutSimpleDesigner,
            options: {
              alwaysOnTop: true
            },
            dtoObject: {
              layoutGuid: utility.newGuid(),
              dataModelGuid: null,
              dataModelType,
              softwareGuid,
              scopeGuid: scopeGuid,
              mode: 'add',
              layoutType: LayoutType.Define
            }
          }
        ).then((result) => {
          if (result) {
            handleSearch();
          }
        });
      } else {
        openModelerController({
          dataModelGuid: utility.newGuid(),
          dataModelType: props.dataModelType,
          softwareGuid: props.softwareGuid,
          scopeGuid: scopeGuid,
          mode: 'add'
        });
      }
    });
  }

  function onDefineCancel() {
    dispatch({
      type: 'DEFINE_VISIBILITY',
      payload: false
    });
  }

  function openModelerController(modelerProps: ModelerProps) {
    commandHandler.openControlFormByCode(
      {
        controlCode: Controls.DDM_Modeler,
        options: {
          alwaysOnTop: true
        },
        dtoObject: modelerProps
      }
    ).then((result) => {
      if (result) {
        handleSearch();
      }
    });
  }
  function handleDefineBySimpleDesigner() {
    if (state.isSimpleDesignerMode) {
      dispatch({
        type: 'DISABLE_SIMPLEDESIGNER',
        payload: {}
      });
    } else {
      dispatch({
        type: 'ENABLE_SIMPLEDESIGNER',
        payload: {}
      });
    }
  }

  return (
    <FormLayout>
      <FormLayout.LayoutContent>
        {!!state.behaviors.length && !!state.scopes.length &&
          <>
            <div>
              <Fieldset legend={translate('Search')} heightRatio={1}>
                <DataModelBriefFilter
                  scopes={state.scopes}
                  onFormCreated={(form) => filterForm.current = form}
                  handleSearch={handleSearch}
                  searchDisable={searchDisable}
                />
              </Fieldset>
            </div>
            <Fieldset legend={translate('DataModels')} heightRatio={1}>
              {state.briefArchiveVisability && <DataModelBriefArchive
                shareable={state.behaviors.find(x => x.Type == props.dataModelType).Shareable}
                handleSearch={handleSearch}
                onRowDoubleClick={handleEdit}
                onStoreCreated={(store) => archiveStore.current = store}
                isSimpleDesignerMode={state.isSimpleDesignerMode}
              />}
            </Fieldset>
            <Modal title={translate('DefineDataModel')}
              visible={state.defineVisibility} closable={false}
              onOk={onDefineOk} onCancel={onDefineCancel}>
              <DefineDataModel
                scopes={state.scopes}
                onFormCreated={(form) => defineForm.current = form} />
            </Modal>
          </>
        }
      </FormLayout.LayoutContent>
      <FormLayout.ActionBar>
        <Button type='primary' onClick={handleEdit}>{translate('Edit')}</Button>
        <Button type='primary' onClick={handleDefine}>{translate('Add')}</Button>
        <Switch onChange={handleDefineBySimpleDesigner} />{translate('SimpleDesigner')}
      </FormLayout.ActionBar>
    </FormLayout >
  )
}

export default injectContext(DataModelBrief);
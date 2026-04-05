import { useState } from "react";
import { DesignerMode } from "../../typings/Core.DynamicDataModel/Enums";
import { LayoutDesignerCommandHandlerParameter } from "../../typings/Core.DynamicDataModel/Types";
import { translate, utility } from "didgah/common";
import { Button, ClickParam, Dropdown, Fieldset, FormLayout, Menu, useCommandHandler, WrappedFormUtils } from "didgah/ant-core-component";
import { TableExViewStore }  from "didgah/ant-core-component/providers";
import React from "react";
import { $enum } from "ts-enum-util";
import { Controls } from "../../Models/Chargoon.Didgah.Common.Domain.Enumeration.Controls";
import { LayoutBriefPagedFilterViewModel } from "../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.LayoutBriefPagedFilterViewModel";
import { LayoutBriefViewModel } from "../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.LayoutBriefViewModel";
import { LayoutType } from "../../Models/Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.LayoutType";
import { setWindowTitle } from "../../Utility/helpers";
import LayoutBriefArchive from "./layoutBriefArchive";
import LayoutBriefFilter from "./layoutBriefFilter";
import { FilterGrid } from '@didgah/ddm-plugins';

interface Action {
  type: string;
  payload: any;
}

export interface LayoutBriefProps {
  dataModelGuid: string;
  dataModelLabel: string;
  onClose?: () => void;
  isSimpleDesignerMode?: boolean;
}

interface LayoutBriefState {
}

function reducer(state: LayoutBriefState, action: Action): LayoutBriefState {
  switch (action.type) {
    default:
      return { ...state };
  }
}

export default function LayoutBrief(props: LayoutBriefProps) {
  const commandHandler = useCommandHandler();
  const [searchDisable,setSearchDisable]=useState<boolean>(false)
  const filterForm = React.useRef<WrappedFormUtils>(null);
  const archiveStore = React.useRef<TableExViewStore<LayoutBriefViewModel, string>>(null);

  React.useEffect(() => {
    if (props.onClose) {
      commandHandler.onClose(props.onClose);
    }
    setWindowTitle(commandHandler, props.dataModelLabel);
    handleSearch();
    return () => {
      commandHandler.removeCloseListener(props.onClose);
    };
  }, []);

  function handleSearch() {
    const data = filterForm.current.getFieldsValue() as LayoutBriefPagedFilterViewModel;
    setSearchDisable(true)
    archiveStore.current.refresh({
      metadata: {
        ...data,
        DataModelGuid: props.dataModelGuid
      } as LayoutBriefPagedFilterViewModel
    }).then(()=>{
      setSearchDisable(false)
    });
  }

  function handleDefine(e: ClickParam) {
    openDesignerController({
      layoutGuid: utility.newGuid(),
      layoutType: $enum(LayoutType).getValueOrThrow(e.key),
      dataModelGuid: props.dataModelGuid,
      mode: DesignerMode.add,
    });
  }

  function handleEdit() {
    const selectedRecord = archiveStore.current.getSelectedRecords()[0];
    if (selectedRecord) {
      openDesignerController({
        layoutGuid: selectedRecord.Guid,
        layoutType: selectedRecord.Type,
        dataModelGuid: selectedRecord.DataModelGuid,
        softwareGuid: "b22832b5-7461-439c-b587-f10d1cdca3b4",
        scopeGuid: 'b27a4886-2115-4aa8-ab0b-fc67ccb17479',
        mode: DesignerMode.edit
      });
    }
  }

  function openDesignerController(designerProps: LayoutDesignerCommandHandlerParameter) {
    const layoutType = designerProps.layoutType;
    commandHandler.openControlFormByCode({
      controlCode: props.isSimpleDesignerMode && layoutType === LayoutType.Define ? Controls.DDM_LayoutSimpleDesigner : Controls.DDM_LayoutDesigner,
      options: {
        alwaysOnTop: true
      },
      dtoObject: {
        ...designerProps,
        plugins: designerProps.plugins 
      }
    }).then(response => {
      if (response) {
        handleSearch();
      }
    });
  }

  function getDefineMenu() {
    return (
      <Menu onClick={handleDefine}>
        {$enum(LayoutType).getKeys()
          .map(x => {
            return (
              <Menu.Item key={x}>
                {translate(`LayoutType_${x}`)}
              </Menu.Item>);
          })}
      </Menu>
    )
  }

  return (
    <FormLayout>
      <FormLayout.LayoutContent>
        <>
          <div>
            <Fieldset legend={translate('Search')} heightRatio={1}>
              <LayoutBriefFilter
                handleSearch={handleSearch}
                onFormCreated={(form) => filterForm.current = form}
                searchDisable={searchDisable}
              />
            </Fieldset>
          </div>
          <Fieldset legend={translate('Layouts')} heightRatio={1}>
            <LayoutBriefArchive
              onRowDoubleClick={handleEdit}
              onStoreCreated={(store) => archiveStore.current = store}
            />
          </Fieldset>
        </>
      </FormLayout.LayoutContent>
      <FormLayout.ActionBar>
        <Button type='primary' onClick={handleEdit}>{translate('Edit')}</Button>

        <Dropdown overlay={getDefineMenu()} trigger={['click']}>
          <Button type='primary'>{translate('Add')}</Button>
        </Dropdown>
      </FormLayout.ActionBar>
    </FormLayout>
  )
}
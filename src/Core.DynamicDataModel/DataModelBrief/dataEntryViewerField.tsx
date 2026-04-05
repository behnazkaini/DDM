import { RendererCommandHandlerParameter } from "../../typings/Core.DynamicDataModel/Types";
import { translate } from "didgah/common";
import { Button, Message, Modal, useCommandHandler, WrappedFormUtils } from "didgah/ant-core-component";
import React from "react";
import { Controls } from "../../Models/Chargoon.Didgah.Common.Domain.Enumeration.Controls";
import { DataModelBriefViewModel } from "../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.DataModelBriefViewModel";
import { LayoutBriefViewModel } from "../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.LayoutBriefViewModel";
import { LayoutType } from "../../Models/Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.LayoutType";
import LayoutSelector, { LayoutSelectorViewModel } from "./layoutSelector";

interface DataEntryViewerFieldProps {
  record: DataModelBriefViewModel;
}

interface DataEntryViewerFieldState {
  defaultLayouts: LayoutBriefViewModel[];
}

interface Action {
  type: 'LAYOUT_SELECTOR'
  payload: any;
}

function reducer(state: DataEntryViewerFieldState, action: Action): DataEntryViewerFieldState {
  switch (action.type) {
    case 'LAYOUT_SELECTOR':
      {
        return { ...state, defaultLayouts: action.payload };
      }
    default:
      return { ...state };
  }
}

export default function DataEntryViewerField(props: DataEntryViewerFieldProps) {

  const commandHandler = useCommandHandler();
  const layoutSelectorForm = React.useRef<WrappedFormUtils>(null);

  const [state, dispatch] = React.useReducer(reducer, {
    defaultLayouts: []
  });

  function openRendererControl(layout: LayoutBriefViewModel) {
    commandHandler.openControlFormByCode(
      {
        controlCode: Controls.DDM_LayoutRenderer,
        options: {
          alwaysOnTop: true
        },
        dtoObject: {
          layoutGuid: layout.Guid,
        } as RendererCommandHandlerParameter
      }
    );
  }

  function openRenderer(): void {
    const defaultLayouts = props.record.Layouts
      .filter(x => (x.Type == LayoutType.DefineArchive || x.Type == LayoutType.InlineArchive) && x.IsDefault);
    if (!!defaultLayouts.length) {
      if (defaultLayouts.length == 1) {
        openRendererControl(defaultLayouts[0]);
      }
      else {
        dispatch({
          type: 'LAYOUT_SELECTOR',
          payload: defaultLayouts
        });
      }
    }
    else {
      Message.error(<span>{translate('DefaultArchiveLayoutDoesNotExist')}</span>, 5);
    }
  }

  function onLayoutSelectorOk() {
    layoutSelectorForm.current
      .validateFields((errors, selectedLayout: LayoutSelectorViewModel) => {
        if (!!errors) {
          return;
        }
        dispatch({
          type: 'LAYOUT_SELECTOR',
          payload: []
        });
        openRendererControl(
          props.record.Layouts.find(x=> x.Guid == selectedLayout.layoutGuid)
        );
      });
  }

  function onLayoutSelectorCancel() {
    dispatch({
      type: 'LAYOUT_SELECTOR',
      payload: []
    })
  }

  return (
    <>
      <Button onClick={openRenderer} />
      <Modal title={translate('DefaultLayouts')}
        closable={false}
        visible={!!state.defaultLayouts.length}
        onOk={onLayoutSelectorOk}
        onCancel={onLayoutSelectorCancel}>
        <LayoutSelector
          layouts={state.defaultLayouts}
          onFormCreated={(form) => layoutSelectorForm.current = form}
        />
      </Modal>
    </>
  )
}
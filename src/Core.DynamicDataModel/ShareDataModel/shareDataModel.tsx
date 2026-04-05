import { translate } from "didgah/common";
import { Button, Fieldset, FormLayout, Spin, useCommandHandler } from "didgah/ant-core-component";
import { CheckboxListStore } from "didgah/ant-core-component/providers";
import { SaveSharedScopesViewModel } from "../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.SaveSharedScopesViewModel";
import React from "react";
import { SoftwareScopeViewModel } from "../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.SoftwareScopeViewModel";
import { setWindowTitle } from "../../Utility/helpers";
import { Action, ScopeStateViewModel, SoftwareScopeStateViewModel } from "./models";
import ScopeList from "./scopeList";
import SoftwareList from './softwareList';
import transporterLayer from "./transporterLayer";

export interface ShareDataModelProps {
  softwareGuid: string;
  dataModelGuid: string;
  dataModelLabel: string;
}

interface ShareDataModelState {
  softwareScopes: SoftwareScopeStateViewModel[];
  selectedSoftwareScope: SoftwareScopeStateViewModel;
  saving: boolean;
}

function reducer(state: ShareDataModelState, action: Action): ShareDataModelState {
  switch (action.type) {
    case 'INIT':
      {
        return {
          ...state,
          softwareScopes: action.payload
        };
      }
    case 'CURRENT_SOFTWARE_SCOPE':
      {
        return {
          ...state,
          softwareScopes: action.payload.softwareScopes,
          selectedSoftwareScope: action.payload.selectedSoftwareScope
        };
      }
    case 'SAVE':
      {
        return {
          ...state,
          softwareScopes: action.payload,
          saving: true
        };
      }
    default:
      return { ...state };
  }
}

export default function ShareDataModel(props: ShareDataModelProps) {

  const { getSoftwareScopes, getSharedScopeGuids, save } = transporterLayer();
  const commandHandler = useCommandHandler();
  const scopesStore = React.useRef<CheckboxListStore>(null);

  const [state, dispatch] = React.useReducer(reducer, {
    softwareScopes: [],
    saving: false,
    selectedSoftwareScope: null
  });

  React.useEffect(() => {
    setWindowTitle(commandHandler, props.dataModelLabel);
    let sharedScopeGuids: string[];
    let softwareScopes: SoftwareScopeViewModel[];
    Promise.all([
      getSharedScopeGuids({ DataModelGuid: props.dataModelGuid }).then(response => sharedScopeGuids = response),
      getSoftwareScopes().then(response => softwareScopes = response)
    ]).then(() => {
      dispatch({
        type: 'INIT',
        payload: toSoftwareScopeStates(sharedScopeGuids, softwareScopes)
      });
    });
  }, []);

  function toSoftwareScopeStates(sharedScopeGuids: string[], softwareScopes: SoftwareScopeViewModel[]): SoftwareScopeStateViewModel[] {
    return softwareScopes.map<SoftwareScopeStateViewModel>(sofwareScope => {
      const scopes = sofwareScope.Scopes.map<ScopeStateViewModel>(scope => {
        return {
          guid: scope.Guid,
          name: scope.Name,
          isShared: sharedScopeGuids.includes(scope.Guid)
        };
      });
      return {
        softwareGuid: sofwareScope.SoftwareGuid,
        softwareTitle: translate(sofwareScope.SoftwareTitle),
        scopes: scopes
      };
    });
  }

  function onSoftwareChanged(selectedSoftwareGuid: string) {
    let softwareScopes = getScopesState();
    const selectedSoftwareScope = softwareScopes.find(x => x.softwareGuid == selectedSoftwareGuid);
    dispatch({
      type: "CURRENT_SOFTWARE_SCOPE",
      payload: {
        softwareScopes: softwareScopes,
        selectedSoftwareScope: selectedSoftwareScope
      }
    });
  }

  function getScopesState(): SoftwareScopeStateViewModel[] {
    let softwareScopes = [...state.softwareScopes];
    if (!!state.selectedSoftwareScope) {
      const prevSelectedScopes = scopesStore.current.getSelectedData();
      const prevSoftwareScopeIndex = softwareScopes.findIndex(x => x.softwareGuid == state.selectedSoftwareScope.softwareGuid);
      const prevSoftwareScope = softwareScopes[prevSoftwareScopeIndex];
      const newSoftawreScope: SoftwareScopeStateViewModel = {
        softwareGuid: prevSoftwareScope.softwareGuid,
        softwareTitle: prevSoftwareScope.softwareTitle,
        scopes: prevSoftwareScope.scopes.map<ScopeStateViewModel>(prevScope => {
          return {
            guid: prevScope.guid,
            name: prevScope.name,
            isShared: !!prevSelectedScopes.find(x => x.value == prevScope.guid)
          };
        })
      }
      softwareScopes[prevSoftwareScopeIndex] = newSoftawreScope;
    }
    return softwareScopes;
  }

  function handleSave() {
    const sharedScopes: SaveSharedScopesViewModel = {
      DataModelGuid: props.dataModelGuid,
      ScopeGuids: getScopesState().reduce<ScopeStateViewModel[]>((a, b) => a.concat(b.scopes), []).filter(x => x.isShared).map(x => x.guid)
    };
    dispatch({
      type: 'SAVE',
      payload: true
    });
    save(sharedScopes)
      .then(() => commandHandler.closeWindow(true));
  }

  return (
    <FormLayout>
      <FormLayout.LayoutContent>
        {!!state.softwareScopes.length &&
          <>
            <Fieldset legend={translate('Search')} heightRatio={1}>
              <SoftwareList
                onChange={onSoftwareChanged}
                softwareScopes={state.softwareScopes}
              />
            </Fieldset>
            {!!state.selectedSoftwareScope &&
              <ScopeList
                softwareScope={state.selectedSoftwareScope}
                onStoreCreated={(store) => scopesStore.current = store}
              />
            }
          </>
        }
      </FormLayout.LayoutContent>
      <FormLayout.ActionBar>
        <Button type='primary' loading={state.saving} onClick={handleSave}>{translate('Save')}</Button>
      </FormLayout.ActionBar>
    </FormLayout>
  )
}
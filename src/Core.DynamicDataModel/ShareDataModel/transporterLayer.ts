import { useAjax } from 'didgah/ant-core-component';
import { SaveSharedScopesViewModel } from "../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.SaveSharedScopesViewModel";
import { SharedScopeGuidsRequestViewModel } from "../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.SharedScopeGuidsRequestViewModel";
import { getApiUrl } from '../../Utility/helpers';

export default function transporterLayer() {
  
  const ajax = useAjax();
  
  const getSoftwareScopes = (): __Didgah_Ajax.AjaxResponse => {
    return ajax.post(getApiUrl('DynamicDataModel', 'Scope', 'GetSoftwareScopes'), {});
  }

  const getSharedScopeGuids = (request: SharedScopeGuidsRequestViewModel): __Didgah_Ajax.AjaxResponse => {
    return ajax.post(getApiUrl('DynamicDataModel', 'Scope', 'GetSharedScopeGuids'), request);
  }

  const save = (request: SaveSharedScopesViewModel): __Didgah_Ajax.AjaxResponse => {
    return ajax.post(getApiUrl('DynamicDataModel', 'Scope', 'SaveSharedScopes'), request);
  }

  return {
    getSoftwareScopes,
    getSharedScopeGuids,
    save
  }
}
import { useAjax } from 'didgah/ant-core-component';
import { ScopeRequestViewModel } from '../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.ScopeRequestViewModel';
import { getApiUrl } from '../../Utility/helpers';

export default function transporterLayer() {
  const ajax = useAjax();

  const getScopes = (request: ScopeRequestViewModel): __Didgah_Ajax.AjaxResponse => {
    return ajax.post(getApiUrl('DynamicDataModel', 'Scope', 'GetScopes'), request);
  }

  const getBehaviors = (): __Didgah_Ajax.AjaxResponse => {
    return ajax.post(getApiUrl('DynamicDataModel', 'DataModel', 'GetBehaviorInformations'), {});
  }

  return {
    getScopes,
    getBehaviors
  }
}
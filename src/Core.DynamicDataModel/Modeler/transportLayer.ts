import { useAjax } from 'didgah/ant-core-component';
import { getApiUrl } from '../../Utility/helpers';
import { SaveDataModelChangesViewModel } from '../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.SaveDataModelChangesViewModel';
import { DataModelRequestViewModel } from '../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.DataModelRequestViewModel';
import { SoftwareModelViewModel } from '../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.DataModel.SoftwareModelViewModel';
import { DataModelBriefViewModel } from '../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.DataModelBriefViewModel';
import { RelationCandidatesRequestViewModel } from '../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.RelationCandidatesRequestViewModel';
import { DataModelBehaviorInformationViewModel } from '../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.DataModelBehaviorInformationViewModel';
import { ScopeRequestViewModel } from '../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.ScopeRequestViewModel';


export default function transportLayer() {
  const ajax = useAjax();

  const get = (id: DataModelRequestViewModel): Promise<SoftwareModelViewModel[]> => {
    return ajax.post(getApiUrl('DynamicDataModel', 'DataModel', 'Get'), id);
  }

  const save = (record: SaveDataModelChangesViewModel) => {
    return ajax.post(getApiUrl('DynamicDataModel', 'DataModel', 'Save'), { ...record });
  }

  const getBehaviorInformations = (): Promise<DataModelBehaviorInformationViewModel[]> => {
    return ajax.post(getApiUrl('DynamicDataModel', 'DataModel', 'GetBehaviorInformations'), {});
  }

  const getRelationCandidates = (data: RelationCandidatesRequestViewModel): DataModelBriefViewModel[] => {
    return ajax.post(getApiUrl('DynamicDataModel', 'DataModel', 'getRelationCandidates'), data);
  }

  const getScopes = (request: ScopeRequestViewModel): __Didgah_Ajax.AjaxResponse => {
    return ajax.post(getApiUrl('DynamicDataModel', 'Scope', 'GetScopes'), request);
  }

  return {
    get,
    save,
    getBehaviorInformations,
    getRelationCandidates,
    getScopes
  } as const
}

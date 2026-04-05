import { DataModelRequestViewModel } from '../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.DataModelRequestViewModel';
import { getApiUrl } from '../../Utility/helpers';
import { HasEntityRequestViewModel } from '../../Models/Chargoon.Didgah.Common5.UI.Models.DynamicDataModel.HasEntityRequestViewModel';

type ConstructorArgs = {
	ajax: __Didgah_Ajax.AjaxContext;
};

export class SearchFormGeneratorTransportLayer {
	ajax: __Didgah_Ajax.AjaxContext;

	constructor({ ajax }: ConstructorArgs) {
		this.ajax = ajax;
	}

	getTables = (args: DataModelRequestViewModel) => this.ajax.post(getApiUrl('DynamicDataModel', 'DataModel', 'Get'), args) ;
	checkHasEntity = (data: HasEntityRequestViewModel) => this.ajax.post(getApiUrl('ExtraModel', 'DynamicDataModel', 'HasEntity'), data) ;

}

export default (ajax: __Didgah_Ajax.AjaxContext) => new SearchFormGeneratorTransportLayer({ ajax });

 
import { getApiUrl } from '../../Utility/helpers';

type ConstructorArgs = {
	ajax: __Didgah_Ajax.AjaxContext;
};

export class LayoutRendererTransportLayer {
	ajax: __Didgah_Ajax.AjaxContext;

	constructor({ ajax }: ConstructorArgs) {
		this.ajax = ajax;
	}
	GetLayoutBriefByGuid = (data) => this.ajax.post(getApiUrl('DynamicDataModel', 'Layout', 'GetBrief'), data);
	GetWebSoftwareComponents = () => this.ajax.post(getApiUrl('DynamicDataModel', 'Layout', 'GetWebSoftwareComponents'), {})
	GetLayoutByGuid = (data) => this.ajax.post(getApiUrl('DynamicDataModel', 'Layout', 'Get'), data);
	GetValueByPrimaryKey = (data) => this.ajax.post(getApiUrl('DynamicDataModel', 'Layout', 'GetValueByPrimaryKey'), data);
	GetConditionValueByPrimaryKey = (data) => this.ajax.post(getApiUrl('DynamicDataModel', 'Layout', 'GetConditionedValueByPrimaryKey'), data);
	GetValue = (data) => this.ajax.post(getApiUrl('DynamicDataModel', 'Layout', 'GetValue'), data);
	Save = (data) => this.ajax.post(getApiUrl('DynamicDataModel', 'Layout', 'SaveValue'), data)
}

export default (ajax: __Didgah_Ajax.AjaxContext) => new LayoutRendererTransportLayer({ ajax });
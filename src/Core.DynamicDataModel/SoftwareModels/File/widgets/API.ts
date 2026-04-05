import { DidgahDeferred } from "didgah/common";

export interface SaveFileParams {
	FileToken: string;
	FileName: string;
	ReferenceGuid: string;
	ExtraData: string;
	DataModelGuid: string;
	SoftwareGuid: string;
}

export interface GetFileInfoParams {
	FileGuids: Array<string>;
	SoftwareGuid: string;
}

export interface GetFileInfoResult {
	DataModelGuid: string;
	Date: string;
	ExtraData: string;
	FileName: string;
	Guid: string;
	Deleted: boolean
	Hash: string;
	Id: number;
	ReferenceGuid: string;
	ReferenceTypeGuid: string;
	RepositoryGuid: string;
}

export default class MODEL_API {
	ajax: __Didgah_Ajax.AjaxContext;
	private APIUrl: string = "/didgah/Core/Common/DynamicDataModel/DistributedFile/";

	constructor({ ajax }: { ajax: __Didgah_Ajax.AjaxContext }) {
		this.ajax = ajax;
	}

	DynamicDistributedFileSave(params: SaveFileParams) {
		const dfd = DidgahDeferred.create<string>();

		this.ajax.post(this.APIUrl + 'Save', { ...params, ReferenceTypeGuid: "7C1FCA75-961A-4150-88D3-FEFC2FD7A430" }).then((result) => {
			dfd.resolve(result);
		}).fail((errors) => {
			dfd.reject(errors);
		});

		return dfd;
	}

	GetFileInfo(params: GetFileInfoParams) {
		const dfd = DidgahDeferred.create<{ result: Array<GetFileInfoResult> }>();

		this.ajax.post(this.APIUrl + 'GetAllFileInfos', params).then((result) => {
			dfd.resolve({ result });
		}).fail((errors) => {
			dfd.reject(errors);
		});

		return dfd;
	}

	GetFileTokenToDownload(params: { FileGuid: string; SoftwareGuid: string; }) {
		const dfd = DidgahDeferred.create<string>();

		this.ajax.post(this.APIUrl + 'GetFileTokenToDownload', params).then((result) => {
			dfd.resolve(result);
		}).fail((errors) => {
			dfd.reject(errors);
		});

		return dfd;
	}
}
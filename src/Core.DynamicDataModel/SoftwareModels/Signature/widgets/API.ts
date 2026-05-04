import { IUserSignatureSettings } from "@models/didgah-components";
import { DidgahDeferred } from "didgah/common";
import { UserSignatureGuidSetting } from "../../../../Models/Chargoon.Didgah.Common5.UI.Models.Extension.UserSignatureGuidSetting";
import { CloneSignatureResponseViewModel } from "../../../../Models/Chargoon.Didgah.Common5.UI.Models.Extension.CloneSignatureResponseViewModel";
import { CloneSignatureRequestViewModel } from "../../../../Models/Chargoon.Didgah.Common5.UI.Models.Extension.CloneSignatureRequestViewModel";

export interface SaveFileParams {
  FileToken: string;
  FileName: string;
  ReferenceGuid: string;
  ExtraData: string;
  DataModelGuid: string;
  ReferenceTypeGuid: string;
}

export interface GetFileInfoParams {
  FileGuids: Array<string>;
  ReferenceTypeGuid: string;
}

export interface GetFileInfoResult {
  DataModelGuid: string;
  Date: string;
  ExtraData: string;
  FileName: string;
  Guid: string;
  ReferenceGuid: string;
  ReferenceTypeGuid: string;
}

export default class MODEL_API {
  ajax: __Didgah_Ajax.AjaxContext;
  private CommonAPIUrl: string = "/didgah/Core/Common/ExtraModel/DynamicDataModel/";
  private BPMS_APIUrl: string = "/didgah/bpm/bpms/Design/";
  private Extension_APIUrl: string = "/applications/Common/Extension";


  constructor({ ajax }: { ajax: __Didgah_Ajax.AjaxContext }) {
    this.ajax = ajax;
  }

  getSignatureToken(signatureId: string) {
    const dfd = DidgahDeferred.create<{ FileName: string; FileToken: string; }>();

    this.ajax.post(this.CommonAPIUrl + 'GetSignatureToken', signatureId).then((result) => {
      dfd.resolve(result);
    }).fail((errors) => {
      dfd.reject(errors);
    });

    return dfd;
  }

  DynamicDistributedFileSave(params: SaveFileParams) {
    const dfd = DidgahDeferred.create<string>();

    this.ajax.post(this.BPMS_APIUrl + 'DynamicDistributedFile/Save', params).then((result) => {
      dfd.resolve(result);
    }).fail((errors) => {
      dfd.reject(errors);
    });

    return dfd;
  }

  GetSignatureSettings() {
    const dfd = DidgahDeferred.create<UserSignatureGuidSetting>();

    this.ajax.post("/applications/Common/ExtensionEx/GetUserSignGuidSettings", {}).then((result: UserSignatureGuidSetting) => {
      dfd.resolve(result);
    }).fail((error) => {
      dfd.reject(error);
    });

    return dfd;
  }

  GetFileInfo(params: GetFileInfoParams, tag: string) {
    const dfd = DidgahDeferred.create<{ result: Array<GetFileInfoResult>, tag: string }>();

    this.ajax.post(this.BPMS_APIUrl + 'DynamicDistributedFile/GetAllFileInfos', params).then((result) => {
      dfd.resolve({ result, tag });
    }).fail((errors) => {
      dfd.reject(errors);
    });

    return dfd;
  }

  cloneSignature(params: CloneSignatureRequestViewModel): Promise<CloneSignatureResponseViewModel> {
    return this.ajax.post(
      `${this.Extension_APIUrl}/CloneSignature`,
      params
    );
  }
}
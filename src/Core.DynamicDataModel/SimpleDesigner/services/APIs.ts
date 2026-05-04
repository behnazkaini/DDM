import { DidgahDeferred } from "didgah/common";
import { LayoutBriefViewModel } from "../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.LayoutBriefViewModel";
import { LayoutType } from "../../../Models/Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.LayoutType";
import { DataModelRequestViewModel } from "../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.DataModelRequestViewModel";
import { DataModelViewModel } from "../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.DataModelViewModel";
import { LayoutRequestViewModel } from "../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.LayoutRequestViewModel";
import { LayoutResponseViewModel } from "../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.LayoutResponseViewModel";
import { SaveLayoutChangesViewModel } from "../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.SaveLayoutChangesViewModel";
import { DataTypeInformationViewModel } from "../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.DataTypeInformationViewModel";
import { WebSoftwareComponentViewModel } from "../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.WebSoftwareComponentViewModel";
import { ConditionGroupViewModel } from "../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.ConditionGroupViewModel";
import { ValidationViewModel } from "../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.ValidationViewModel";
import { SaveSimpleChangesViewModel } from "../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.Simple.SaveSimpleChangesViewModel";

export default class DDM_API {
  ajax: __Didgah_Ajax.AjaxContext;
  private APIUrl: string = "/didgah/Core/Common/DynamicDataModel/";

  constructor({ ajax }: { ajax: __Didgah_Ajax.AjaxContext }) {
    this.ajax = ajax;
  }

  GetDataModelByGuid(
    request: DataModelRequestViewModel
  ): DidgahDeferred<DataModelViewModel[]> {
    let deferred = DidgahDeferred.create();
    this.ajax
      .post({
        url: this.APIUrl + "DataModel/Get",
        data: request,
      })
      .done((data) => {
        deferred.resolve(data);
      })
      .fail((errors) => {
        console.error(errors);
        deferred.reject(errors);
      });

    return deferred;
  }


  GetLayoutByGuid(
    Request: LayoutRequestViewModel
  ): DidgahDeferred<LayoutResponseViewModel> {
    let deferred = DidgahDeferred.create();
    this.ajax
      .post({
        url: this.APIUrl + "Layout/Get",
        data: { ...Request },
      })
      .done((data) => {
        deferred.resolve(data);
      })
      .fail((errors) => {
        console.error(errors);
        deferred.reject(errors);
      });

    return deferred;
  }

  SaveLayout(Request: SaveLayoutChangesViewModel): DidgahDeferred<boolean> {
    let deferred = DidgahDeferred.create();
    this.ajax
      .post({
        url: this.APIUrl + "Layout/Save",
        data: { ...Request },
      })
      .done((data) => {
        deferred.resolve(data);
      })
      .fail((errors) => {
        deferred.reject(errors);
      });

    return deferred;
  }

  SimpleDesignerSaveLayout(Request: SaveSimpleChangesViewModel): DidgahDeferred<boolean> {
    let deferred = DidgahDeferred.create();
    this.ajax
      .post({
        url: this.APIUrl + "Simple/Save",
        data: { ...Request },
      })
      .done((data) => {
        deferred.resolve(data);
      })
      .fail((errors) => {
        deferred.reject(errors);
      });

    return deferred;
  }

  GetDataModelLayouts(Request: { DataModelGuid: string; LayoutType: LayoutType }): DidgahDeferred<Array<LayoutBriefViewModel>> {
    let deferred = DidgahDeferred.create();
    this.ajax
      .post({
        url: this.APIUrl + "Layout/GetDataModelLayouts",
        data: { ...Request },
      })
      .done((data) => {
        deferred.resolve(data);
      })
      .fail((errors) => {
        console.error(errors);
        deferred.reject(errors);
      });

    return deferred;
  }

  GetDataTypeInformations(): DidgahDeferred<Array<DataTypeInformationViewModel>> {
    let deferred = DidgahDeferred.create();
    this.ajax
      .post({
        url: this.APIUrl + "DataModel/GetDataTypeInformations",
        data: {},
      })
      .done((data) => {
        deferred.resolve(data);
      })
      .fail((errors) => {
        console.error(errors);
        deferred.reject(errors);
      });

    return deferred;
  }

  GetWebSoftwareComponents(): DidgahDeferred<Array<WebSoftwareComponentViewModel>> {
    let deferred = DidgahDeferred.create();
    this.ajax
      .post({
        url: this.APIUrl + "Layout/GetWebSoftwareComponents",
        data: { ...Request },
      })
      .done((data) => {
        deferred.resolve(data);
      })
      .fail((errors) => {
        console.error(errors);
        deferred.reject(errors);
      });

    return deferred;
  }
}

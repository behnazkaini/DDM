import { ApiCallHttpMethod } from "./Chargoon.Didgah.Common.Domain.Enumeration.ApiCallHttpMethod";
import { WebServiceHeaderViewModel } from "./Chargoon.Didgah.Common5.UI.Models.Admin.ManageWebService.WebServiceHeaderViewModel";
import { WebServiceQueryParameterViewModel } from "./Chargoon.Didgah.Common5.UI.Models.Admin.ManageWebService.WebServiceQueryParameterViewModel";
import { ApiEncoding } from "./Chargoon.Didgah.Common5.UI.Models.Admin.ManageWebService.ApiEncoding";

export interface WebApiMethodViewModel {
  EndPoint: string;
  Method: ApiCallHttpMethod;
  Headers: WebServiceHeaderViewModel[];
  QueryParameters: WebServiceQueryParameterViewModel[];
  Body: string;
  MediaType: string;
  Encoding: ApiEncoding;
}

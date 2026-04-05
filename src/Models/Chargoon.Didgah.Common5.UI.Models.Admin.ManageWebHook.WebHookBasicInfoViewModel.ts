import { WebHookCallHttpMethod } from "./Chargoon.Didgah.Common.Domain.Enumeration.WebHookCallHttpMethod";
import { WebHookHeaderViewModel } from "./Chargoon.Didgah.Common5.UI.Models.Admin.ManageWebHook.WebHookHeaderViewModel";
import { WebHookQueryParameterViewModel } from "./Chargoon.Didgah.Common5.UI.Models.Admin.ManageWebHook.WebHookQueryParameterViewModel";

export interface WebHookBasicInfoViewModel {
  Guid: string;
  WebServiceGuid: string;
  Title: string;
  WebServiceTitle: string;
  Method: WebHookCallHttpMethod;
  EndPoint: string;
  Headers: WebHookHeaderViewModel[];
  QueryParameters: WebHookQueryParameterViewModel[];
}

import { WebServiceNodeType } from "./Chargoon.Didgah.Common.Domain.Enumeration.WebServiceNodeType";
import { WebApiAuthenticationType } from "./Chargoon.Didgah.InteractionManager.Contracts.Common.WebApiAuthentication.WebApiAuthenticationType";
import { IWebApiAuthenticationViewModel } from "./Chargoon.Didgah.Common5.UI.Models.Admin.ManageWebService.IWebApiAuthenticationViewModel";
import { WebServiceHeaderViewModel } from "./Chargoon.Didgah.Common5.UI.Models.Admin.ManageWebService.WebServiceHeaderViewModel";
import { WebServiceQueryParameterViewModel } from "./Chargoon.Didgah.Common5.UI.Models.Admin.ManageWebService.WebServiceQueryParameterViewModel";

export interface WebServiceDetailViewModel {
  Guid: string;
  Title: string;
  EnglishTitle: string;
  Url: string;
  Username: string;
  Passweord: string;
  NodeType: WebServiceNodeType;
  Accesses: string[];
  AuthenticationType: WebApiAuthenticationType;
  Authentication: IWebApiAuthenticationViewModel;
  Headers: WebServiceHeaderViewModel[];
  QueryParameters: WebServiceQueryParameterViewModel[];
}

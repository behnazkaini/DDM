import { WebServiceNodeType } from "./Chargoon.Didgah.Common.Domain.Enumeration.WebServiceNodeType";
import { WebApiAuthenticationType } from "./Chargoon.Didgah.InteractionManager.Contracts.Common.WebApiAuthentication.WebApiAuthenticationType";
import { ApiKeyAuthenticationViewModel } from "./Chargoon.Didgah.Common5.UI.Models.Admin.ManageWebService.ApiKeyAuthenticationViewModel";
import { OAuth2AuthenticationViewModel } from "./Chargoon.Didgah.Common5.UI.Models.Admin.ManageWebService.OAuth2AuthenticationViewModel";
import { BasicAuthenticationViewModel } from "./Chargoon.Didgah.Common5.UI.Models.Admin.ManageWebService.BasicAuthenticationViewModel";
import { BearerTokenAuthenticationViewModel } from "./Chargoon.Didgah.Common5.UI.Models.Admin.ManageWebService.BearerTokenAuthenticationViewModel";
import { WebServiceHeaderViewModel } from "./Chargoon.Didgah.Common5.UI.Models.Admin.ManageWebService.WebServiceHeaderViewModel";
import { WebServiceQueryParameterViewModel } from "./Chargoon.Didgah.Common5.UI.Models.Admin.ManageWebService.WebServiceQueryParameterViewModel";

export interface WebServiceSaveViewModel {
  Guid: string;
  Title: string;
  EnglishTitle: string;
  Url: string;
  Username: string;
  Passweord: string;
  NodeType: WebServiceNodeType;
  Accesses: string[];
  AuthenticationType: WebApiAuthenticationType;
  ApiKeyAuthentication: ApiKeyAuthenticationViewModel;
  OAuth2Authentication: OAuth2AuthenticationViewModel;
  BasicAuthentication: BasicAuthenticationViewModel;
  BearerTokenAuthentication: BearerTokenAuthenticationViewModel;
  Headers: WebServiceHeaderViewModel[];
  QueryParameters: WebServiceQueryParameterViewModel[];
}

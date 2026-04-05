import { IWebApiAuthenticationViewModel } from "./Chargoon.Didgah.Common5.UI.Models.Admin.ManageWebService.IWebApiAuthenticationViewModel";
import { AuthenticationInfoSendType } from "./Chargoon.Didgah.InteractionManager.Contracts.Common.WebApiAuthentication.AuthenticationInfoSendType";

export interface OAuth2AuthenticationViewModel extends IWebApiAuthenticationViewModel {
  AccessTokenUrl: string;
  Scope: string;
  ClientID: string;
  ClientSecret: string;
  UseBodyRequest: boolean;
  OAuthSendType: AuthenticationInfoSendType;
}
